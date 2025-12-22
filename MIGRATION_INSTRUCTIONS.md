# How to Run the Settings Migration

## Step 1: Access Your Database

### If using Neon:
1. Go to https://console.neon.tech
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. You'll see a query editor

### If using another PostgreSQL database:
- Use your database management tool (pgAdmin, DBeaver, etc.)
- Or connect via command line: `psql -h your-host -U your-user -d your-database`

## Step 2: Run the Migration Script

Copy and paste the ENTIRE contents of `migration-add-settings-fields.sql` into your SQL editor and run it.

**OR** run each section one by one:

### Add Cryptomus fields:
```sql
ALTER TABLE "admin_settings" 
ADD COLUMN IF NOT EXISTS "cryptomusMerchantId" TEXT,
ADD COLUMN IF NOT EXISTS "cryptomusApiKey" TEXT,
ADD COLUMN IF NOT EXISTS "cryptomusDisplayName" TEXT,
ADD COLUMN IF NOT EXISTS "cryptomusTestMode" BOOLEAN DEFAULT false;
```

### Add BigPay fields:
```sql
ALTER TABLE "admin_settings" 
ADD COLUMN IF NOT EXISTS "bigPayMerchantId" TEXT,
ADD COLUMN IF NOT EXISTS "bigPayDisplayName" TEXT,
ADD COLUMN IF NOT EXISTS "bigPayApiSecret" TEXT,
ADD COLUMN IF NOT EXISTS "bigPayTestMode" BOOLEAN DEFAULT false;
```

### Add Exit Intent fields:
```sql
ALTER TABLE "admin_settings" 
ADD COLUMN IF NOT EXISTS "exitIntentEnabled" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "exitIntentTitle" TEXT,
ADD COLUMN IF NOT EXISTS "exitIntentSubtitle" TEXT,
ADD COLUMN IF NOT EXISTS "exitIntentDiscountCode" TEXT;
```

### Add Feature Flags:
```sql
ALTER TABLE "admin_settings" 
ADD COLUMN IF NOT EXISTS "newServiceIndicator" BOOLEAN DEFAULT true;
```

### Add Site Configuration:
```sql
ALTER TABLE "admin_settings" 
ADD COLUMN IF NOT EXISTS "supportEmail" TEXT;
```

## Step 3: Verify the Migration

Run this query to check if all columns were added:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_settings' 
AND column_name IN (
  'cryptomusMerchantId', 'cryptomusApiKey', 'cryptomusDisplayName', 'cryptomusTestMode',
  'bigPayMerchantId', 'bigPayDisplayName', 'bigPayApiSecret', 'bigPayTestMode',
  'exitIntentEnabled', 'exitIntentTitle', 'exitIntentSubtitle', 'exitIntentDiscountCode',
  'newServiceIndicator', 'supportEmail'
)
ORDER BY column_name;
```

You should see all 14 columns listed.

## Step 4: Restart Your Dev Server

After running the migration:
1. Stop your Next.js dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. Try saving settings again at `/admin/settings`

## Troubleshooting

If you get an error saying a column already exists, that's okay - the `IF NOT EXISTS` clause will skip it.

If you get permission errors, make sure you're using a user with ALTER TABLE permissions.

