# LikeIO: DigitalOcean → AWS Migration Plan

## Current State (DigitalOcean)

| Component | Current Setup |
|---|---|
| App | DigitalOcean App Platform (Next.js) |
| Database | DigitalOcean Managed PostgreSQL |
| Email | SendGrid (external, stays) |
| Payments | Checkout.com, BigPayMe, Cryptomus, Ziina (external, stays) |
| Order Fulfillment | JAP API (external, stays) |

---

## AWS Target Architecture

### 1. Next.js App → AWS App Runner or Amplify

**Recommended: AWS App Runner**
- Closest equivalent to DO App Platform — deploy from a container or GitHub, auto-scaling, no infra management
- Alternatively: **AWS Amplify Hosting** (native Next.js support, SSR included)
- If you want full control: **ECS Fargate** behind an ALB (more complex, more flexible)

**Amplify** is easiest if you want a DO App Platform-like experience. **App Runner** is better if you're already containerizing. **ECS Fargate** is best if you expect significant scale.

### 2. PostgreSQL → Amazon RDS (PostgreSQL)

- Direct equivalent to DigitalOcean Managed PostgreSQL
- Recommend **RDS Multi-AZ** for production HA
- Or **Aurora Serverless v2** if you want auto-scaling DB (costs more but handles traffic spikes)
- Prisma connection string swap is a single env var change (`DATABASE_URL`)

### 3. Static Assets / Media → S3 + CloudFront

- If you're serving any uploaded images or static files from DO Spaces or local disk, move to S3
- CloudFront CDN in front for edge caching and fast delivery globally

### 4. Secrets / Env Vars → AWS Secrets Manager or Parameter Store

- All your API keys (JAP, RapidAPI, Checkout.com, SendGrid, NextAuth secret, etc.) move to AWS Secrets Manager
- App Runner / ECS can inject these as env vars at runtime

### 5. Cron Jobs / Background Workers → EventBridge Scheduler + Lambda

- Any cron-based tasks (order status polling, cleanup jobs, etc.) → EventBridge Scheduler triggering a Lambda or hitting an internal API route
- If you have queue-based work → SQS + Lambda

### 6. Domain / DNS

- Move DNS to **Route 53** (or keep existing registrar and just point to AWS endpoints)
- ACM (AWS Certificate Manager) for free SSL certs

---

## Migration Phases

| Phase | Description |
|---|---|
| Phase 1 | Infrastructure Setup (no downtime) |
| Phase 2 | Database Migration |
| Phase 3 | App Deployment & Testing |
| Phase 4 | DNS Cutover |

---

## Key Risks

| Risk | Mitigation |
|---|---|
| **DB connection pooling** | RDS has connection limits; add PgBouncer or use RDS Proxy (~$0.015/hr) |
| **Cold starts** | App Runner has warm instances; Amplify SSR can have cold start on low traffic — configure min instances |
| **VPC networking** | RDS must be in same VPC as app, or use RDS Proxy with public endpoint carefully |
| **NextAuth NEXTAUTH_URL** | Must be updated to new domain/IP or app won't redirect OAuth correctly |
| **Payment webhook IPs** | Checkout.com, Ziina etc. send webhooks — ensure app is publicly reachable and update webhook URLs in each gateway's dashboard |
| **AdminSettings memory cache** | 5-min in-memory cache is per-instance; with multiple App Runner containers this works fine but is not shared state |

---

## Cost Rough Estimate (monthly)

| Service | Estimated Cost |
|---|---|
| App Runner (1 vCPU / 2GB, auto-scale) | ~$25–60 |
| RDS PostgreSQL db.t3.medium Multi-AZ | ~$60–80 |
| CloudFront + S3 | ~$5–15 |
| Route 53 | ~$1–2 |
| Secrets Manager | ~$2–5 |
| **Total** | **~$90–160/mo** |

---

## Recommendation

If the primary driver is **ease of management**, DO App Platform is already quite good. AWS makes sense if you need:

- **More compute control** (custom instance types, GPU, etc.)
- **AWS ecosystem** (SQS, EventBridge, Lambda for background jobs)
- **Compliance requirements** (SOC2, HIPAA — RDS has more compliance certs)
- **Cost optimization at scale** (Reserved Instances on RDS can cut DB cost ~40%)

The migration itself is **moderate complexity** — the biggest risk is the database cutover and ensuring all webhook endpoints (5 payment gateways) are updated before going live.

> See [aws-migration-detailed-steps.md](aws-migration-detailed-steps.md) for the full step-by-step runbook.
