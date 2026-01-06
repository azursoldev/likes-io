
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.21.1
 * Query Engine version: bf0e5e8a04cada8225617067eaa03d041e2bba36
 */
Prisma.prismaVersion = {
  client: "5.21.1",
  engine: "bf0e5e8a04cada8225617067eaa03d041e2bba36"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  isBlocked: 'isBlocked',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  avatarUrl: 'avatarUrl'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  serviceId: 'serviceId',
  platform: 'platform',
  serviceType: 'serviceType',
  quantity: 'quantity',
  price: 'price',
  currency: 'currency',
  status: 'status',
  link: 'link',
  japOrderId: 'japOrderId',
  japStatus: 'japStatus',
  upsellData: 'upsellData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ServiceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  platform: 'platform',
  serviceType: 'serviceType',
  japServiceId: 'japServiceId',
  basePrice: 'basePrice',
  markup: 'markup',
  finalPrice: 'finalPrice',
  minQuantity: 'minQuantity',
  maxQuantity: 'maxQuantity',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  gateway: 'gateway',
  transactionId: 'transactionId',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  webhookData: 'webhookData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UpsellScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  serviceId: 'serviceId',
  packageId: 'packageId',
  basePrice: 'basePrice',
  discountType: 'discountType',
  discountValue: 'discountValue',
  badgeText: 'badgeText',
  badgeColor: 'badgeColor',
  badgeIcon: 'badgeIcon',
  platform: 'platform',
  serviceType: 'serviceType',
  minSubtotal: 'minSubtotal',
  isActive: 'isActive',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SocialProfileScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  username: 'username',
  profileData: 'profileData',
  posts: 'posts',
  cachedAt: 'cachedAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.SocialProofScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  username: 'username',
  service: 'service',
  timeText: 'timeText',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdminSettingsScalarFieldEnum = {
  id: 'id',
  japApiUrl: 'japApiUrl',
  japApiKey: 'japApiKey',
  checkoutApiKey: 'checkoutApiKey',
  checkoutWebhookSecret: 'checkoutWebhookSecret',
  bigPayMeApiKey: 'bigPayMeApiKey',
  bigPayMeWebhookSecret: 'bigPayMeWebhookSecret',
  rapidApiKey: 'rapidApiKey',
  rapidApiInstagramHost: 'rapidApiInstagramHost',
  rapidApiTikTokHost: 'rapidApiTikTokHost',
  rapidApiYouTubeHost: 'rapidApiYouTubeHost',
  smtpHost: 'smtpHost',
  smtpPort: 'smtpPort',
  smtpSecure: 'smtpSecure',
  smtpUser: 'smtpUser',
  smtpPass: 'smtpPass',
  smtpFrom: 'smtpFrom',
  defaultCurrency: 'defaultCurrency',
  cryptomusMerchantId: 'cryptomusMerchantId',
  cryptomusApiKey: 'cryptomusApiKey',
  cryptomusDisplayName: 'cryptomusDisplayName',
  cryptomusTestMode: 'cryptomusTestMode',
  bigPayMerchantId: 'bigPayMerchantId',
  bigPayDisplayName: 'bigPayDisplayName',
  bigPayApiSecret: 'bigPayApiSecret',
  bigPayTestMode: 'bigPayTestMode',
  exitIntentEnabled: 'exitIntentEnabled',
  exitIntentTitle: 'exitIntentTitle',
  exitIntentSubtitle: 'exitIntentSubtitle',
  exitIntentDiscountCode: 'exitIntentDiscountCode',
  newServiceIndicator: 'newServiceIndicator',
  supportEmail: 'supportEmail',
  updatedAt: 'updatedAt',
  bannerDurationHours: 'bannerDurationHours',
  bannerEnabled: 'bannerEnabled',
  inboxCount: 'inboxCount',
  teamCount: 'teamCount',
  faviconUrl: 'faviconUrl',
  footerLogoUrl: 'footerLogoUrl',
  headerLogoUrl: 'headerLogoUrl',
  homeMetaDescription: 'homeMetaDescription',
  homeMetaTitle: 'homeMetaTitle',
  robotsTxtContent: 'robotsTxtContent',
  recaptchaSecretKey: 'recaptchaSecretKey',
  recaptchaSiteKey: 'recaptchaSiteKey',
  googleClientId: 'googleClientId',
  googleClientSecret: 'googleClientSecret',
  facebookClientId: 'facebookClientId',
  facebookClientSecret: 'facebookClientSecret',
  myFatoorahToken: 'myFatoorahToken',
  myFatoorahBaseURL: 'myFatoorahBaseURL',
  myFatoorahTestMode: 'myFatoorahTestMode',
  myFatoorahWebhookSecret: 'myFatoorahWebhookSecret'
};

exports.Prisma.HomepageContentScalarFieldEnum = {
  id: 'id',
  heroTitle: 'heroTitle',
  heroSubtitle: 'heroSubtitle',
  heroRating: 'heroRating',
  heroReviewCount: 'heroReviewCount',
  heroCtaButtons: 'heroCtaButtons',
  isActive: 'isActive',
  updatedAt: 'updatedAt',
  benefits: 'benefits',
  heroProfileEngagement: 'heroProfileEngagement',
  heroProfileFollowers: 'heroProfileFollowers',
  heroProfileHandle: 'heroProfileHandle',
  heroProfileLikes: 'heroProfileLikes',
  heroProfileRole: 'heroProfileRole',
  influenceSubtitle: 'influenceSubtitle',
  influenceTitle: 'influenceTitle',
  platformSubtitle: 'platformSubtitle',
  platformTitle: 'platformTitle',
  quickStartDescription1: 'quickStartDescription1',
  quickStartDescription2: 'quickStartDescription2',
  quickStartTitle: 'quickStartTitle',
  whyChooseSubtitle: 'whyChooseSubtitle',
  whyChooseTitle: 'whyChooseTitle',
  platformCards: 'platformCards',
  heroProfileImage: 'heroProfileImage',
  influenceImage: 'influenceImage',
  influenceSteps: 'influenceSteps',
  quickStartButtons: 'quickStartButtons'
};

exports.Prisma.TeamMemberScalarFieldEnum = {
  id: 'id',
  name: 'name',
  role: 'role',
  description: 'description',
  twitterUrl: 'twitterUrl',
  linkedinUrl: 'linkedinUrl',
  avatarUrl: 'avatarUrl',
  displayOrder: 'displayOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HeroSocialUpdateScalarFieldEnum = {
  id: 'id',
  handle: 'handle',
  item: 'item',
  time: 'time',
  displayOrder: 'displayOrder',
  isActive: 'isActive'
};

exports.Prisma.PromoBarScalarFieldEnum = {
  id: 'id',
  messages: 'messages',
  countdownSeconds: 'countdownSeconds',
  isVisible: 'isVisible',
  displayOrder: 'displayOrder',
  updatedAt: 'updatedAt'
};

exports.Prisma.FeaturedOnScalarFieldEnum = {
  id: 'id',
  brandName: 'brandName',
  logoUrl: 'logoUrl',
  displayOrder: 'displayOrder',
  isActive: 'isActive'
};

exports.Prisma.FeaturedOnPageLinkScalarFieldEnum = {
  id: 'id',
  featuredOnId: 'featuredOnId',
  pagePath: 'pagePath',
  link: 'link',
  nofollow: 'nofollow'
};

exports.Prisma.PlatformSectionScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  title: 'title',
  description: 'description',
  tags: 'tags',
  ctaText: 'ctaText',
  isActive: 'isActive'
};

exports.Prisma.GetStartedContentScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  packType: 'packType',
  quality: 'quality',
  features: 'features',
  explanation: 'explanation',
  pricing: 'pricing',
  isActive: 'isActive'
};

exports.Prisma.InfluenceSectionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  steps: 'steps',
  isActive: 'isActive'
};

exports.Prisma.AdvantageSectionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  subtitle: 'subtitle',
  items: 'items',
  isActive: 'isActive'
};

exports.Prisma.QuickStartSectionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  buttons: 'buttons',
  isActive: 'isActive'
};

exports.Prisma.ServicePageContentScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  serviceType: 'serviceType',
  slug: 'slug',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  heroTitle: 'heroTitle',
  heroSubtitle: 'heroSubtitle',
  heroRating: 'heroRating',
  heroReviewCount: 'heroReviewCount',
  assuranceCardText: 'assuranceCardText',
  learnMoreText: 'learnMoreText',
  learnMoreModalContent: 'learnMoreModalContent',
  packages: 'packages',
  qualityCompare: 'qualityCompare',
  howItWorks: 'howItWorks',
  isActive: 'isActive',
  updatedAt: 'updatedAt',
  benefits: 'benefits',
  moreServicesTitle: 'moreServicesTitle',
  moreServicesHighlight: 'moreServicesHighlight',
  moreServicesBody: 'moreServicesBody',
  moreServicesButtons: 'moreServicesButtons'
};

exports.Prisma.FAQScalarFieldEnum = {
  id: 'id',
  question: 'question',
  answer: 'answer',
  category: 'category',
  platform: 'platform',
  serviceType: 'serviceType',
  displayOrder: 'displayOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  orderId: 'orderId',
  rating: 'rating',
  comment: 'comment',
  authorName: 'authorName',
  isPublished: 'isPublished',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PasswordResetTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tokenHash: 'tokenHash',
  expiresAt: 'expiresAt',
  usedAt: 'usedAt',
  createdAt: 'createdAt'
};

exports.Prisma.TestimonialScalarFieldEnum = {
  id: 'id',
  handle: 'handle',
  text: 'text',
  rating: 'rating',
  role: 'role',
  platform: 'platform',
  serviceType: 'serviceType',
  isApproved: 'isApproved',
  isFeatured: 'isFeatured',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BlogPostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  excerpt: 'excerpt',
  coverImage: 'coverImage',
  authorId: 'authorId',
  category: 'category',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  isPublished: 'isPublished',
  publishedAt: 'publishedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LegalPageScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  sections: 'sections',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailTemplateScalarFieldEnum = {
  id: 'id',
  type: 'type',
  subject: 'subject',
  body: 'body',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BellNotificationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  icon: 'icon',
  priority: 'priority',
  category: 'category',
  iconBg: 'iconBg',
  isRead: 'isRead',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BannerMessageScalarFieldEnum = {
  id: 'id',
  text: 'text',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  icon: 'icon'
};

exports.Prisma.IconAssetScalarFieldEnum = {
  id: 'id',
  name: 'name',
  category: 'category',
  url: 'url',
  alt: 'alt',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  code: 'code',
  type: 'type',
  value: 'value',
  currency: 'currency',
  status: 'status',
  startsAt: 'startsAt',
  expiresAt: 'expiresAt',
  maxRedemptions: 'maxRedemptions',
  maxRedemptionsPerUser: 'maxRedemptionsPerUser',
  minOrderAmount: 'minOrderAmount',
  applicableServices: 'applicableServices',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponRedemptionScalarFieldEnum = {
  id: 'id',
  couponId: 'couponId',
  userId: 'userId',
  orderId: 'orderId',
  redeemedAt: 'redeemedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

exports.Platform = exports.$Enums.Platform = {
  INSTAGRAM: 'INSTAGRAM',
  TIKTOK: 'TIKTOK',
  YOUTUBE: 'YOUTUBE',
  REVIEWS: 'REVIEWS'
};

exports.ServiceType = exports.$Enums.ServiceType = {
  LIKES: 'LIKES',
  FOLLOWERS: 'FOLLOWERS',
  VIEWS: 'VIEWS',
  SUBSCRIBERS: 'SUBSCRIBERS'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

exports.PaymentGateway = exports.$Enums.PaymentGateway = {
  CHECKOUT_COM: 'CHECKOUT_COM',
  BIGPAYME: 'BIGPAYME',
  CRYPTOMUS: 'CRYPTOMUS',
  MYFATOORAH: 'MYFATOORAH'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.DiscountType = exports.$Enums.DiscountType = {
  PERCENT: 'PERCENT',
  FIXED: 'FIXED'
};

exports.CouponType = exports.$Enums.CouponType = {
  PERCENT: 'PERCENT',
  FIXED: 'FIXED'
};

exports.CouponStatus = exports.$Enums.CouponStatus = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Order: 'Order',
  Service: 'Service',
  Payment: 'Payment',
  Upsell: 'Upsell',
  SocialProfile: 'SocialProfile',
  SocialProof: 'SocialProof',
  AdminSettings: 'AdminSettings',
  HomepageContent: 'HomepageContent',
  TeamMember: 'TeamMember',
  HeroSocialUpdate: 'HeroSocialUpdate',
  PromoBar: 'PromoBar',
  FeaturedOn: 'FeaturedOn',
  FeaturedOnPageLink: 'FeaturedOnPageLink',
  PlatformSection: 'PlatformSection',
  GetStartedContent: 'GetStartedContent',
  InfluenceSection: 'InfluenceSection',
  AdvantageSection: 'AdvantageSection',
  QuickStartSection: 'QuickStartSection',
  ServicePageContent: 'ServicePageContent',
  FAQ: 'FAQ',
  Review: 'Review',
  PasswordResetToken: 'PasswordResetToken',
  Testimonial: 'Testimonial',
  BlogPost: 'BlogPost',
  LegalPage: 'LegalPage',
  EmailTemplate: 'EmailTemplate',
  BellNotification: 'BellNotification',
  BannerMessage: 'BannerMessage',
  IconAsset: 'IconAsset',
  Coupon: 'Coupon',
  CouponRedemption: 'CouponRedemption'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
