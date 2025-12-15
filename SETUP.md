# Setup Guide - Multi-Platform Social Media Growth Platform

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Accounts for:
  - RapidAPI (for Instagram/TikTok/YouTube data)
  - JAP API (for order automation)
  - Checkout.com (payment gateway)
  - BigPayMe (payment gateway)
  - SMTP email service

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database
2. Copy `.env.example` to `.env`
3. Update `DATABASE_URL` in `.env` with your database connection string

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Run Database Migrations

```bash
npm run db:push
```

Or for production:

```bash
npm run db:migrate
```

### 5. Configure Environment Variables

Update `.env` with all required API keys and credentials:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your application URL
- JAP API credentials
- Payment gateway credentials (Checkout.com, BigPayMe)
- RapidAPI credentials for all platforms
- SMTP email configuration

### 6. Create Admin User

You'll need to create an admin user manually in the database or through a script:

```sql
-- Hash password with bcrypt (use online tool or script)
INSERT INTO "User" (id, email, password, role, "createdAt")
VALUES ('admin-id', 'admin@example.com', '$2a$10$hashedpassword', 'ADMIN', NOW());
```

### 7. Start Development Server

```bash
npm run dev
```

## Key Features Implemented

### Backend Infrastructure
- ✅ PostgreSQL database with Prisma ORM
- ✅ NextAuth.js authentication
- ✅ Role-based access control (User/Admin)
- ✅ API routes for all core functionality

### Social Media Integration
- ✅ Unified social media API service (Instagram, TikTok, YouTube)
- ✅ Profile and posts/videos fetching
- ✅ URL validation
- ✅ Caching layer

### JAP API Integration
- ✅ Service synchronization
- ✅ Order creation
- ✅ Order status polling
- ✅ Admin service management

### Payment Integration
- ✅ Checkout.com integration
- ✅ BigPayMe integration
- ✅ Webhook handlers
- ✅ Payment status tracking

### Order Management
- ✅ Order creation and tracking
- ✅ Status updates
- ✅ Background polling job
- ✅ User and admin dashboards

### Email Notifications
- ✅ Email service with templates
- ✅ Order confirmation
- ✅ Payment success/failure
- ✅ Order completion

### CMS (Content Management System)
- ✅ Homepage content management
- ✅ Service page content management
- ✅ FAQ management
- ✅ Testimonials management
- ✅ Blog management
- ✅ Featured brands management
- ✅ More CMS routes available

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Social Media
- `GET /api/social/[platform]/profile?username=...` - Get profile
- `GET /api/social/[platform]/posts?username=...` - Get posts/videos
- `POST /api/social/[platform]/validate` - Validate URL

### Orders
- `GET /api/orders` - List orders (filtered by user/admin)
- `POST /api/orders` - Create order
- `GET /api/orders/[orderId]/status` - Get order status

### Payments
- `POST /api/payments/checkout/create` - Create Checkout.com session
- `POST /api/payments/bigpayme/create` - Create BigPayMe session
- `POST /api/webhooks/checkout` - Checkout.com webhook
- `POST /api/webhooks/bigpayme` - BigPayMe webhook

### Admin - JAP
- `POST /api/admin/jap/sync` - Sync services from JAP
- `GET /api/admin/jap/services` - List services
- `POST /api/admin/jap/services` - Create service
- `PUT /api/admin/jap/services` - Update service
- `DELETE /api/admin/jap/services` - Delete service

### CMS
- `GET /api/cms/homepage` - Get homepage content
- `PUT /api/cms/homepage` - Update homepage content
- `GET /api/cms/faq` - Get FAQs
- `POST /api/cms/faq` - Create FAQ
- `GET /api/cms/testimonials` - Get testimonials
- `POST /api/cms/testimonials` - Create testimonial
- `GET /api/cms/blog` - Get blog posts
- `POST /api/cms/blog` - Create blog post
- `GET /api/cms/service-pages/[platform]/[serviceType]` - Get service page content
- And more...

## Cron Jobs

Set up a cron job to poll order statuses:

```bash
# Every 5 minutes
*/5 * * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/cron/order-status
```

Or use Vercel Cron:

```json
{
  "crons": [{
    "path": "/api/cron/order-status",
    "schedule": "*/5 * * * *"
  }]
}
```

## Next Steps

1. **Frontend Integration**: Update frontend components to fetch from CMS APIs
2. **Admin UI**: Complete admin panel UI for all CMS features
3. **Testing**: Add unit and integration tests
4. **Deployment**: Deploy to production with proper environment variables
5. **Monitoring**: Set up error tracking and monitoring

## Database Schema

The database includes models for:
- Users, Orders, Services, Payments
- Social Profiles (cached)
- All CMS content (Homepage, FAQs, Testimonials, Blog, etc.)
- Admin Settings

See `prisma/schema.prisma` for full schema.

## Support

For issues or questions, refer to the plan document or contact the development team.

