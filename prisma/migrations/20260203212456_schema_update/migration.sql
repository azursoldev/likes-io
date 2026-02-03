/*
  Warnings:

  - The primary key for the `email_templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `email_templates` table. All the data in the column will be lost.
  - You are about to drop the column `variables` on the `email_templates` table. All the data in the column will be lost.
  - The primary key for the `faqs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `link` on the `featured_on` table. All the data in the column will be lost.
  - The primary key for the `icon_assets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isApproved` on the `reviews` table. All the data in the column will be lost.
  - The primary key for the `team_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bio` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `team_members` table. All the data in the column will be lost.
  - The primary key for the `testimonials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `blog_posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `currency_rates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seo_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_proof` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `icon_assets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `service_page_content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `icon_assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Made the column `comment` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `description` to the `team_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `team_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `testimonials` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `testimonials` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "WalletTxnType" AS ENUM ('CREDIT', 'DEBIT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentGateway" ADD VALUE 'CRYPTOMUS';
ALTER TYPE "PaymentGateway" ADD VALUE 'MYFATOORAH';
ALTER TYPE "PaymentGateway" ADD VALUE 'WALLET';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Platform" ADD VALUE 'REVIEWS';
ALTER TYPE "Platform" ADD VALUE 'FREE_INSTAGRAM';

-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropIndex
DROP INDEX "email_templates_isActive_idx";

-- DropIndex
DROP INDEX "email_templates_type_idx";

-- DropIndex
DROP INDEX "faqs_displayOrder_idx";

-- DropIndex
DROP INDEX "faqs_platform_serviceType_idx";

-- DropIndex
DROP INDEX "icon_assets_category_idx";

-- DropIndex
DROP INDEX "icon_assets_displayOrder_idx";

-- DropIndex
DROP INDEX "reviews_isApproved_idx";

-- DropIndex
DROP INDEX "reviews_userId_idx";

-- DropIndex
DROP INDEX "testimonials_displayOrder_idx";

-- DropIndex
DROP INDEX "testimonials_isFeatured_idx";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "upsellData" JSONB,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "admin_settings" ADD COLUMN     "bannerDurationHours" INTEGER NOT NULL DEFAULT 24,
ADD COLUMN     "bannerEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bigPayApiSecret" TEXT,
ADD COLUMN     "bigPayDisplayName" TEXT,
ADD COLUMN     "bigPayMerchantId" TEXT,
ADD COLUMN     "bigPayTestMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cryptomusApiKey" TEXT,
ADD COLUMN     "cryptomusDisplayName" TEXT,
ADD COLUMN     "cryptomusMerchantId" TEXT,
ADD COLUMN     "cryptomusTestMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customSitemapXml" TEXT,
ADD COLUMN     "exitIntentDiscountCode" TEXT,
ADD COLUMN     "exitIntentEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "exitIntentSubtitle" TEXT,
ADD COLUMN     "exitIntentTitle" TEXT,
ADD COLUMN     "facebookClientId" TEXT,
ADD COLUMN     "facebookClientSecret" TEXT,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "footerLogoUrl" TEXT,
ADD COLUMN     "googleAnalyticsId" TEXT,
ADD COLUMN     "googleClientId" TEXT,
ADD COLUMN     "googleClientSecret" TEXT,
ADD COLUMN     "googleSiteVerification" TEXT,
ADD COLUMN     "headerLogoUrl" TEXT,
ADD COLUMN     "homeMetaDescription" TEXT,
ADD COLUMN     "homeMetaTitle" TEXT,
ADD COLUMN     "inboxCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "myFatoorahBaseURL" TEXT DEFAULT 'https://apitest.myfatoorah.com',
ADD COLUMN     "myFatoorahTestMode" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "myFatoorahToken" TEXT,
ADD COLUMN     "myFatoorahWebhookSecret" TEXT,
ADD COLUMN     "newServiceIndicator" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "recaptchaSecretKey" TEXT,
ADD COLUMN     "recaptchaSiteKey" TEXT,
ADD COLUMN     "robotsTxtContent" TEXT DEFAULT 'User-agent: *
Allow: /',
ADD COLUMN     "sitemapEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "smtpFrom" TEXT,
ADD COLUMN     "smtpPort" INTEGER,
ADD COLUMN     "smtpSecure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supportEmail" TEXT,
ADD COLUMN     "systemStatus" TEXT DEFAULT 'Operational',
ADD COLUMN     "systemStatusEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "systemStatusMessage" TEXT DEFAULT 'All Systems Operational',
ADD COLUMN     "teamCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "email_templates" DROP CONSTRAINT "email_templates_pkey",
DROP COLUMN "name",
DROP COLUMN "variables",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "email_templates_id_seq";

-- AlterTable
ALTER TABLE "faqs" DROP CONSTRAINT "faqs_pkey",
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "faqs_id_seq";

-- AlterTable
ALTER TABLE "featured_on" DROP COLUMN "link";

-- AlterTable
ALTER TABLE "get_started_content" ADD COLUMN     "explanationTitle" TEXT,
ADD COLUMN     "heading" TEXT;

-- AlterTable
ALTER TABLE "homepage_content" ADD COLUMN     "benefits" JSONB,
ADD COLUMN     "getStartedMainHeading" TEXT,
ADD COLUMN     "getStartedPlatformIcons" JSONB,
ADD COLUMN     "heroProfileEngagement" TEXT,
ADD COLUMN     "heroProfileFollowers" TEXT,
ADD COLUMN     "heroProfileHandle" TEXT,
ADD COLUMN     "heroProfileImage" TEXT,
ADD COLUMN     "heroProfileLikes" TEXT,
ADD COLUMN     "heroProfileRole" TEXT,
ADD COLUMN     "influenceImage" TEXT,
ADD COLUMN     "influenceSteps" JSONB,
ADD COLUMN     "influenceSubtitle" TEXT,
ADD COLUMN     "influenceTitle" TEXT,
ADD COLUMN     "platformCards" JSONB,
ADD COLUMN     "platformSubtitle" TEXT,
ADD COLUMN     "platformTitle" TEXT,
ADD COLUMN     "quickStartButtons" JSONB,
ADD COLUMN     "quickStartDescription1" TEXT,
ADD COLUMN     "quickStartDescription2" TEXT,
ADD COLUMN     "quickStartTitle" TEXT,
ADD COLUMN     "serviceIcons" JSONB,
ADD COLUMN     "socialProofLabel" TEXT DEFAULT 'just purchased',
ADD COLUMN     "whyChooseSubtitle" TEXT,
ADD COLUMN     "whyChooseTitle" TEXT;

-- AlterTable
ALTER TABLE "icon_assets" DROP CONSTRAINT "icon_assets_pkey",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "url" DROP NOT NULL,
ADD CONSTRAINT "icon_assets_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "icon_assets_id_seq";

-- AlterTable
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_pkey",
DROP COLUMN "isApproved",
ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "comment" SET NOT NULL,
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "reviews_id_seq";

-- AlterTable
ALTER TABLE "service_page_content" ADD COLUMN     "benefits" JSONB,
ADD COLUMN     "customEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customMaxQuantity" INTEGER,
ADD COLUMN     "customMinQuantity" INTEGER,
ADD COLUMN     "customRoundToStep" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customStep" INTEGER,
ADD COLUMN     "learnMoreModalContent" TEXT,
ADD COLUMN     "learnMoreText" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "moreServicesBody" TEXT,
ADD COLUMN     "moreServicesButtons" JSONB,
ADD COLUMN     "moreServicesHighlight" TEXT,
ADD COLUMN     "moreServicesTitle" TEXT,
ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_pkey",
DROP COLUMN "bio",
DROP COLUMN "photo",
DROP COLUMN "socialLinks",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "team_members_id_seq";

-- AlterTable
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_pkey",
ADD COLUMN     "serviceType" "ServiceType",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'Verified Buyer',
ALTER COLUMN "rating" SET NOT NULL,
ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "testimonials_id_seq";

-- DropTable
DROP TABLE "blog_posts";

-- DropTable
DROP TABLE "currency_rates";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "seo_settings";

-- DropTable
DROP TABLE "social_proof";

-- CreateTable
CREATE TABLE "Upsell" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "serviceId" TEXT,
    "packageId" TEXT,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENT',
    "discountValue" DOUBLE PRECISION NOT NULL,
    "badgeText" TEXT,
    "badgeColor" TEXT DEFAULT 'red',
    "badgeIcon" TEXT,
    "platform" "Platform",
    "serviceType" "ServiceType",
    "minSubtotal" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Upsell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialProof" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "timeText" TEXT NOT NULL,
    "notificationLabel" TEXT NOT NULL DEFAULT 'just purchased',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "providerMessageId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "featured_on_page_links" (
    "id" SERIAL NOT NULL,
    "featuredOnId" INTEGER NOT NULL,
    "pagePath" TEXT NOT NULL,
    "link" TEXT,
    "nofollow" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "featured_on_page_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "authorId" TEXT NOT NULL,
    "teamMemberId" TEXT,
    "category" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bell_notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'low',
    "category" TEXT NOT NULL DEFAULT 'system',
    "iconBg" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bell_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_messages" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🔥',

    CONSTRAINT "banner_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "CouponType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "currency" TEXT DEFAULT 'USD',
    "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "maxRedemptions" INTEGER,
    "maxRedemptionsPerUser" INTEGER,
    "minOrderAmount" DOUBLE PRECISION,
    "applicableServices" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemptions" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "userId" TEXT,
    "orderId" TEXT,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "free_tool_page_content" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "reviewCount" TEXT NOT NULL,
    "step1Title" TEXT,
    "step1Description" TEXT,
    "step2Title" TEXT,
    "step2Description" TEXT,
    "step3Title" TEXT,
    "step3Description" TEXT,
    "inputLabel" TEXT,
    "inputPlaceholder" TEXT,
    "buttonText" TEXT,
    "assurance1" TEXT,
    "assurance2" TEXT,
    "assurance3" TEXT,
    "faqs" JSONB,
    "reviews" JSONB,
    "reviewsTitle" TEXT,
    "reviewsSubtitle" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "free_tool_page_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "type" "WalletTxnType" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation" (
    "id" TEXT NOT NULL,
    "headerMenu" JSONB,
    "footerMenu" JSONB,
    "headerColumnMenus" JSONB,
    "footerColumnMenus" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Upsell_isActive_idx" ON "Upsell"("isActive");

-- CreateIndex
CREATE INDEX "Upsell_platform_serviceType_idx" ON "Upsell"("platform", "serviceType");

-- CreateIndex
CREATE INDEX "email_logs_userId_idx" ON "email_logs"("userId");

-- CreateIndex
CREATE INDEX "email_logs_type_idx" ON "email_logs"("type");

-- CreateIndex
CREATE INDEX "email_logs_status_idx" ON "email_logs"("status");

-- CreateIndex
CREATE INDEX "featured_on_page_links_featuredOnId_idx" ON "featured_on_page_links"("featuredOnId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_isPublished_idx" ON "BlogPost"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "legal_pages_slug_key" ON "legal_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_code_idx" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_status_idx" ON "coupons"("status");

-- CreateIndex
CREATE INDEX "coupon_redemptions_couponId_idx" ON "coupon_redemptions"("couponId");

-- CreateIndex
CREATE INDEX "coupon_redemptions_userId_idx" ON "coupon_redemptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "free_tool_page_content_slug_key" ON "free_tool_page_content"("slug");

-- CreateIndex
CREATE INDEX "WalletTransaction_userId_createdAt_idx" ON "WalletTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "faqs_platform_idx" ON "faqs"("platform");

-- CreateIndex
CREATE INDEX "faqs_serviceType_idx" ON "faqs"("serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "icon_assets_name_key" ON "icon_assets"("name");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "service_page_content_slug_key" ON "service_page_content"("slug");

-- CreateIndex
CREATE INDEX "testimonials_serviceType_idx" ON "testimonials"("serviceType");

-- AddForeignKey
ALTER TABLE "featured_on_page_links" ADD CONSTRAINT "featured_on_page_links_featuredOnId_fkey" FOREIGN KEY ("featuredOnId") REFERENCES "featured_on"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
