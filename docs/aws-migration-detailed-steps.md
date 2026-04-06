# LikeIO: AWS Migration — Detailed Step-by-Step Runbook

> Reference: [aws-migration-overview.md](aws-migration-overview.md)

---

## Prerequisites

- AWS account with billing set up
- AWS CLI installed and configured (`aws configure`)
- `pg_dump` / `pg_restore` available locally
- Access to DigitalOcean dashboard (DB connection string, env vars)
- Access to all payment gateway dashboards (Checkout.com, BigPayMe, Cryptomus, Ziina)
- Domain registrar access (to update DNS)

---

## Phase 1 — AWS Infrastructure Setup

### Step 1.1 — Create IAM Roles

1. Log into AWS Console → IAM → Roles
2. Create a role for **App Runner** with policies:
   - `AmazonRDSFullAccess` (or scoped read/write)
   - `SecretsManagerReadWrite`
   - `AmazonS3FullAccess` (or scoped to your bucket)
   - `CloudWatchLogsFullAccess`
3. Create a separate **deploy role** for CI/CD (GitHub Actions or manual) with:
   - `AmazonECRFullAccess` (if containerizing)
   - `apprunner:CreateService`, `apprunner:UpdateService`

### Step 1.2 — Create a VPC

1. AWS Console → VPC → Create VPC
2. Name: `likeio-vpc`
3. CIDR: `10.0.0.0/16`
4. Create **2 public subnets** (for App Runner / NAT Gateway):
   - `10.0.1.0/24` — `us-east-1a`
   - `10.0.2.0/24` — `us-east-1b`
5. Create **2 private subnets** (for RDS):
   - `10.0.3.0/24` — `us-east-1a`
   - `10.0.4.0/24` — `us-east-1b`
6. Create an **Internet Gateway**, attach to VPC
7. Create a **NAT Gateway** in one public subnet (for outbound traffic from private subnets)
8. Update route tables:
   - Public subnets: route `0.0.0.0/0` → Internet Gateway
   - Private subnets: route `0.0.0.0/0` → NAT Gateway

### Step 1.3 — Security Groups

Create the following security groups in `likeio-vpc`:

**`likeio-app-sg`** (App Runner / ECS):
- Inbound: port 3000 from `0.0.0.0/0` (or ALB only)
- Outbound: all traffic

**`likeio-rds-sg`** (RDS):
- Inbound: port 5432 from `likeio-app-sg` only
- Outbound: none

### Step 1.4 — Provision RDS PostgreSQL

1. AWS Console → RDS → Create Database
2. Engine: **PostgreSQL 15** (match your DO version — check with `SELECT version();`)
3. Template: **Production**
4. DB instance identifier: `likeio-prod`
5. Master username: `likeio_admin`
6. Master password: generate a strong password, save it
7. Instance class: `db.t3.medium` (upgrade later if needed)
8. Storage: 20 GB gp3, enable **autoscaling** up to 100 GB
9. **Multi-AZ**: Yes (for production HA)
10. VPC: `likeio-vpc`
11. Subnet group: create new using the **private subnets** created above
12. Security group: `likeio-rds-sg`
13. Public access: **No**
14. Database name: `likeio`
15. Enable **automated backups**, retention: 7 days
16. Enable **Performance Insights**
17. Click **Create Database** — wait ~10 min

> **Optional but recommended:** Enable **RDS Proxy** to handle connection pooling. Prisma opens a new connection per serverless invocation which can exhaust RDS limits under load.
> - RDS → Proxies → Create Proxy → attach to your RDS instance
> - Use the proxy endpoint as `DATABASE_URL` instead of the RDS direct endpoint

### Step 1.5 — Create S3 Bucket

1. AWS Console → S3 → Create Bucket
2. Name: `likeio-assets` (must be globally unique, e.g. `likeio-assets-prod`)
3. Region: same as RDS (e.g. `us-east-1`)
4. Block all public access: **Yes** (serve via CloudFront only)
5. Enable versioning: optional but useful
6. Click **Create Bucket**

### Step 1.6 — Create CloudFront Distribution

1. AWS Console → CloudFront → Create Distribution
2. Origin domain: select your S3 bucket
3. Origin access: **Origin Access Control (OAC)** — create new OAC
4. Update S3 bucket policy when prompted (CloudFront will show you the policy)
5. Cache behavior: default settings, enable **Compress objects automatically**
6. Viewer protocol policy: **Redirect HTTP to HTTPS**
7. Price class: use all edge locations or price class 100 (US/EU only) to save cost
8. Note the **CloudFront domain** (e.g. `d1abc123.cloudfront.net`) — this becomes your `NEXT_PUBLIC_CDN_URL`

### Step 1.7 — Store Secrets in AWS Secrets Manager

1. AWS Console → Secrets Manager → Store a new secret
2. Type: **Other type of secret** (key/value pairs)
3. Add all env vars from your DigitalOcean app:

```
DATABASE_URL=postgresql://likeio_admin:<password>@<rds-endpoint>:5432/likeio
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=https://likes.io
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
CHECKOUT_COM_SECRET_KEY=...
BIGPAYME_API_KEY=...
CRYPTOMUS_API_KEY=...
ZIINA_API_KEY=...
JAP_API_KEY=...
RAPIDAPI_KEY=...
SENDGRID_API_KEY=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
NEXT_PUBLIC_CDN_URL=https://d1abc123.cloudfront.net
```

4. Secret name: `likeio/prod`
5. Enable automatic rotation: optional (manual is fine for API keys)

---

## Phase 2 — Database Migration

### Step 2.1 — Export from DigitalOcean

On your local machine:

```bash
# Get your DO DB connection string from the DO dashboard
# Format: postgresql://user:password@host:port/dbname?sslmode=require

pg_dump \
  --no-owner \
  --no-acl \
  --format=custom \
  --file=likeio_backup_$(date +%Y%m%d).dump \
  "postgresql://doadmin:<password>@<do-db-host>:25060/defaultdb?sslmode=require"
```

### Step 2.2 — Verify the Dump

```bash
# List contents to confirm it looks complete
pg_restore --list likeio_backup_<date>.dump | head -50

# Count tables
pg_restore --list likeio_backup_<date>.dump | grep "TABLE DATA" | wc -l
```

Expect 28+ table entries matching your Prisma schema.

### Step 2.3 — Restore to RDS

Since RDS is in a private subnet, you need a bastion or use an EC2 instance temporarily:

**Option A — EC2 Bastion (recommended):**
1. Launch a small EC2 (`t3.micro`, Amazon Linux 2) in a **public subnet** of `likeio-vpc`
2. Security group: allow SSH from your IP only
3. Copy your dump file to the bastion:
   ```bash
   scp -i your-key.pem likeio_backup_<date>.dump ec2-user@<bastion-ip>:~/
   ```
4. SSH into bastion and install PostgreSQL client:
   ```bash
   ssh -i your-key.pem ec2-user@<bastion-ip>
   sudo amazon-linux-extras install postgresql14
   ```
5. Restore from bastion to RDS:
   ```bash
   pg_restore \
     --no-owner \
     --no-acl \
     --dbname="postgresql://likeio_admin:<password>@<rds-endpoint>:5432/likeio" \
     likeio_backup_<date>.dump
   ```

**Option B — AWS DMS (for zero-downtime live migration):**
- Use AWS Database Migration Service for ongoing replication
- More complex but keeps DO and RDS in sync until final cutover
- Recommended if you can't afford any downtime

### Step 2.4 — Verify Data

Connect to RDS from the bastion and check row counts:

```sql
SELECT schemaname, tablename, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

Cross-check critical tables (User, Order, Payment, WalletTransaction) against DO counts.

### Step 2.5 — Run Prisma Migrations

From your local machine (or CI), point `DATABASE_URL` at RDS via bastion tunnel:

```bash
# Set up SSH tunnel through bastion
ssh -i your-key.pem -L 5433:<rds-endpoint>:5432 ec2-user@<bastion-ip> -N &

# Run migrations
DATABASE_URL="postgresql://likeio_admin:<password>@localhost:5433/likeio" \
  npx prisma migrate deploy
```

---

## Phase 3 — App Deployment

### Step 3.1 — Add a Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

Add to `next.config.js`:
```js
output: 'standalone',
```

### Step 3.2 — Push Image to ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name likeio --region us-east-1

# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t likeio .
docker tag likeio:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/likeio:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/likeio:latest
```

### Step 3.3 — Deploy to AWS App Runner

1. AWS Console → App Runner → Create Service
2. Source: **Container registry** → Amazon ECR
3. Select your `likeio` repo, tag `latest`
4. Deployment trigger: **Automatic** (re-deploys on new ECR push)
5. Service name: `likeio-prod`
6. CPU: 1 vCPU, Memory: 2 GB
7. Environment variables: link to Secrets Manager secret `likeio/prod`
8. Health check: path `/api/health` (or `/`) — add a simple health route if not present
9. Auto scaling: min 1, max 5 instances
10. Security: attach the IAM role created in Step 1.1
11. Click **Create & Deploy** — wait ~5 min for first deployment

### Step 3.4 — Test on App Runner Domain

App Runner provides a URL like `https://abc123.us-east-1.awsapprunner.com`.

Test the following before touching DNS:

- [ ] Homepage loads
- [ ] User signup / login (Credentials)
- [ ] Google OAuth login
- [ ] Facebook OAuth login
- [ ] Service pages load (Instagram, TikTok, YouTube)
- [ ] Add to cart / checkout flow
- [ ] Payment initiation — Checkout.com
- [ ] Payment initiation — BigPayMe
- [ ] Payment initiation — Cryptomus
- [ ] Payment initiation — Ziina
- [ ] Wallet top-up and deduction
- [ ] Order placement and JAP API fulfillment
- [ ] Email receipt delivery (SendGrid)
- [ ] Admin dashboard loads and data is visible
- [ ] CMS content updates save correctly
- [ ] Coupon codes apply correctly

### Step 3.5 — Update Payment Gateway Webhook URLs

For each gateway, update the webhook endpoint from the DO URL to the App Runner URL (or your domain after DNS cutover):

| Gateway | Dashboard URL | Webhook setting |
|---|---|---|
| Checkout.com | business.checkout.com | Webhooks → update to `https://likes.io/api/webhooks/checkout` |
| BigPayMe | bigpayme dashboard | Update callback URL |
| Cryptomus | app.cryptomus.com | Merchant → Webhooks |
| Ziina | dashboard.ziina.com | Developer → Webhooks |

> Do this **before** DNS cutover so no payments are missed during the transition window.

---

## Phase 4 — DNS Cutover

### Step 4.1 — Request SSL Certificate in ACM

1. AWS Console → Certificate Manager → Request Certificate
2. Type: **Public certificate**
3. Domain: `likes.io` and `www.likes.io`
4. Validation: **DNS validation** (add the CNAME records to your registrar)
5. Wait for status to change to **Issued** (~5–30 min)

### Step 4.2 — Attach Custom Domain to App Runner

1. App Runner → your service → Custom domains → Add domain
2. Enter `likes.io`
3. AWS will show CNAME records to add — add them to your DNS registrar
4. Wait for validation

### Step 4.3 — Lower DNS TTL

Before cutover, lower your current DNS TTL to **60 seconds** (minimum your registrar allows). This reduces propagation time during the switch.

Wait at least 1x the current TTL after lowering before proceeding.

### Step 4.4 — Final DB Sync

If using DMS (live replication): let it run until lag is near zero.

If using dump/restore: take one final snapshot of DO DB and restore delta:

```bash
# Dump only rows created after your initial migration timestamp
pg_dump \
  --no-owner \
  --no-acl \
  --format=custom \
  --file=likeio_delta_$(date +%Y%m%d_%H%M).dump \
  "postgresql://doadmin:<password>@<do-db-host>:25060/defaultdb?sslmode=require"

# Restore to RDS (accept any conflicts with --on-conflict-do-nothing via psql or use DMS)
```

### Step 4.5 — Maintenance Mode (Optional)

If zero data loss is critical:
1. Enable a maintenance page on the DO app (block writes)
2. Take final DB dump
3. Restore to RDS
4. Flip DNS

### Step 4.6 — Update DNS

Point your domain to the App Runner custom domain:

| Record | Type | Value |
|---|---|---|
| `likes.io` | CNAME | `<apprunner-custom-domain-value>` |
| `www.likes.io` | CNAME | `<apprunner-custom-domain-value>` |

### Step 4.7 — Update NEXTAUTH_URL

Update the `NEXTAUTH_URL` secret in Secrets Manager from the App Runner test URL to `https://likes.io`. Redeploy the app (or trigger a new deployment).

### Step 4.8 — Monitor

Watch for 30–60 minutes after cutover:

- **CloudWatch Logs** → App Runner service logs for errors
- **RDS Performance Insights** → query latency, active connections
- **CloudWatch Metrics** → App Runner request count, 4xx/5xx rates
- Manual test: place a real order through each payment gateway

---

## Phase 5 — Post-Migration Cleanup

### Step 5.1 — Decommission DigitalOcean Resources

Wait **48 hours** of stable AWS operation before destroying DO resources.

1. DO App Platform → destroy the app
2. DO Databases → destroy the PostgreSQL cluster (after confirming RDS has all data)
3. Any DO Spaces buckets → migrate content to S3 first, then destroy

### Step 5.2 — Terminate EC2 Bastion

```bash
aws ec2 terminate-instances --instance-ids <bastion-instance-id>
```

### Step 5.3 — Set Up Ongoing Backups

- RDS: automated backups already enabled (7-day retention)
- Add a **manual snapshot** weekly via EventBridge → Lambda:
  ```bash
  aws rds create-db-snapshot \
    --db-instance-identifier likeio-prod \
    --db-snapshot-identifier likeio-weekly-$(date +%Y%m%d)
  ```

### Step 5.4 — Set Up CloudWatch Alarms

Create alarms for:
- App Runner 5xx error rate > 1% → SNS email alert
- RDS CPU > 80% for 5 min → SNS email alert
- RDS storage < 20% free → SNS email alert
- RDS connections > 80% of max → SNS email alert

### Step 5.5 — Set Up GitHub Actions for CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS App Runner

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push image
        run: |
          docker build -t likeio .
          docker tag likeio:latest ${{ secrets.ECR_URI }}:latest
          docker push ${{ secrets.ECR_URI }}:latest
```

App Runner auto-deploys when a new image is pushed to ECR.

---

## Rollback Plan

If issues arise after DNS cutover:

1. **Revert DNS** back to DO App Platform endpoint (propagates in ~60 sec with low TTL)
2. DO app and database are still running — no data was deleted
3. Investigate issue in AWS staging environment
4. Re-attempt cutover once resolved

> Keep DO resources running for at least 48 hours post-cutover before destroying them.

---

## Checklist Summary

### Infrastructure
- [ ] IAM roles created
- [ ] VPC + subnets + security groups configured
- [ ] RDS PostgreSQL provisioned (Multi-AZ)
- [ ] RDS Proxy enabled (optional but recommended)
- [ ] S3 bucket + CloudFront distribution created
- [ ] Secrets Manager populated with all env vars

### Database
- [ ] pg_dump from DO completed and verified
- [ ] pg_restore to RDS completed
- [ ] Row counts validated across all 28 models
- [ ] Prisma migrations applied

### App
- [ ] Dockerfile added, `output: 'standalone'` in next.config.js
- [ ] Docker image built and pushed to ECR
- [ ] App Runner service deployed
- [ ] All 5 payment gateways tested end-to-end on App Runner URL
- [ ] OAuth (Google + Facebook) tested
- [ ] Webhook URLs updated in all payment gateway dashboards

### Cutover
- [ ] ACM certificate issued
- [ ] App Runner custom domain verified
- [ ] DNS TTL lowered to 60s
- [ ] Final DB sync completed
- [ ] DNS records updated
- [ ] NEXTAUTH_URL updated in Secrets Manager
- [ ] Post-cutover monitoring active for 60 min

### Cleanup
- [ ] DO App Platform destroyed
- [ ] DO PostgreSQL destroyed
- [ ] EC2 bastion terminated
- [ ] CloudWatch alarms configured
- [ ] GitHub Actions CI/CD pipeline set up
