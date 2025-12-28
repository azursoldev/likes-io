
const defaultIcons = [
  // Logos
  { name: "LikesLogo", category: "Logos", url: "", customText: "Likes", isCustom: true },
  { name: "LikesInCheckoutLogo", category: "Logos", url: "", customText: "Likes", isCustom: true },
  { name: "Buzzoid", category: "Logos", url: "", customText: "Buzzoid.svg", isCustom: true },
  
  // General UI Icons
  { name: "HamburgerIcon", category: "General UI Icons", url: "", iconType: "faBars" },
  { name: "XIcon", category: "General UI Icons", url: "", iconType: "faXmark" },
  { name: "ChevronDownIcon", category: "General UI Icons", url: "", iconType: "faChevronDown" },
  { name: "ChevronRightIcon", category: "General UI Icons", url: "", iconType: "faChevronRight" },
  { name: "ChevronUpIcon", category: "General UI Icons", url: "", iconType: "faChevronUp" },
  { name: "HeartIcon", category: "General UI Icons", url: "", iconType: "faHeart" },
  { name: "UserIcon", category: "General UI Icons", url: "", iconType: "faUser" },
  { name: "ChatIcon", category: "General UI Icons", url: "", iconType: "faComment" },
  { name: "EyeIcon", category: "General UI Icons", url: "", iconType: "faEye" },
  { name: "EyeSlashIcon", category: "General UI Icons", url: "", iconType: "faEyeSlash" },
  { name: "InformationCircleIcon", category: "General UI Icons", url: "", iconType: "faCircleInfo" },
  { name: "StarIcon", category: "General UI Icons", url: "", iconType: "faStar" },
  { name: "BookOpenIcon", category: "General UI Icons", url: "", iconType: "faBookOpen" },
  { name: "BellIcon", category: "General UI Icons", url: "", iconType: "faBell" },
  { name: "CheckCircleIcon", category: "General UI Icons", url: "", iconType: "faCheckCircle" },
  { name: "FireIcon", category: "General UI Icons", url: "", iconType: "faFire" },
  { name: "ShieldCheckIcon", category: "General UI Icons", url: "", iconType: "faShield" },
  { name: "AwardIcon", category: "General UI Icons", url: "", iconType: "faAward" },
  { name: "LifebuoyIcon", category: "General UI Icons", url: "", iconType: "faLifeRing" },
  { name: "VerifiedIcon", category: "General UI Icons", url: "", iconType: "faShield" },
  { name: "QuestionMarkCircleIcon", category: "General UI Icons", url: "", iconType: "faQuestionCircle" },
  { name: "CheckmarkIcon", category: "General UI Icons", url: "", iconType: "faCheck" },
  { name: "ClockIcon", category: "General UI Icons", url: "", iconType: "faClock" },
  { name: "SendIcon", category: "General UI Icons", url: "", iconType: "faPaperPlane" },
  { name: "SparklesIcon", category: "General UI Icons", url: "", iconType: "faStar" },
  { name: "ArrowLeftIcon", category: "General UI Icons", url: "", iconType: "faArrowLeft" },
  { name: "ArrowRightIcon", category: "General UI Icons", url: "", iconType: "faArrowRight" },
  { name: "ArrowUpIcon", category: "General UI Icons", url: "", iconType: "faArrowUp" },
  { name: "PlusIcon", category: "General UI Icons", url: "", iconType: "faPlus" },
  { name: "MinusIcon", category: "General UI Icons", url: "", iconType: "faMinus" },
  { name: "SearchIcon", category: "General UI Icons", url: "", iconType: "faSearch" },
  { name: "ShareIcon", category: "General UI Icons", url: "", iconType: "faShare" },
  { name: "MailIcon", category: "General UI Icons", url: "", iconType: "faEnvelope" },
  { name: "LinkIcon", category: "General UI Icons", url: "", iconType: "faLink" },
  { name: "SunIcon", category: "General UI Icons", url: "", iconType: "faSun" },
  { name: "MoonIcon", category: "General UI Icons", url: "", iconType: "faMoon" },
  { name: "HomeIcon", category: "General UI Icons", url: "", iconType: "faHome" },
  { name: "PlayCircleIcon", category: "General UI Icons", url: "", iconType: "faPlayCircle" },
  { name: "HeadphoneIcon", category: "General UI Icons", url: "", iconType: "faHeadphones" },
  { name: "ThumbsUpIcon", category: "General UI Icons", url: "", iconType: "faThumbsUp" },
  { name: "RefreshIcon", category: "General UI Icons", url: "", iconType: "faRotate" },
  { name: "LockClosedIcon", category: "General UI Icons", url: "", iconType: "faLock" },
  { name: "CreditCardIcon", category: "General UI Icons", url: "", iconType: "faCreditCard" },
  { name: "CurrencyBitcoinIcon", category: "General UI Icons", url: "", iconType: "faBitcoinSign" },
  { name: "DashboardIcon", category: "General UI Icons", url: "", iconType: "faGauge" },
  { name: "OrderHistoryIcon", category: "General UI Icons", url: "", iconType: "faList" },
  { name: "SettingsIcon", category: "General UI Icons", url: "", iconType: "faGear" },
  { name: "LogoutIcon", category: "General UI Icons", url: "", iconType: "faArrowRightFromBracket" },
  { name: "FilterIcon", category: "General UI Icons", url: "", iconType: "faFilter" },
  { name: "InstagramProfileIcon", category: "General UI Icons", url: "", iconType: "faUserCircle" },
  { name: "TagIcon", category: "General UI Icons", url: "", iconType: "faTag" },
  
  // Admin Panel Icons
  { name: "ClipboardDocumentListIcon", category: "Admin Panel Icons", url: "", iconType: "faClipboardList" },
  { name: "CubeIcon", category: "Admin Panel Icons", url: "", iconType: "faCube" },
  { name: "CogIcon", category: "Admin Panel Icons", url: "", iconType: "faGear" },
  { name: "ChartIcon", category: "Admin Panel Icons", url: "", iconType: "faChartBar" },
  { name: "CurrencyDollarIcon", category: "Admin Panel Icons", url: "", iconType: "faDollarSign" },
  { name: "PhotoIcon", category: "Admin Panel Icons", url: "", iconType: "faImage" },
  
  // Social, Payment, & Brand Icons
  { name: "VisaIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "VISA", isCustom: true },
  { name: "MastercardIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "MC", isCustom: true },
  { name: "AmexIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "AMEX", isCustom: true },
  { name: "DiscoverIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "DIS", isCustom: true },
  { name: "ApplePayIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "AP", isCustom: true },
  { name: "AppleIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "🍎", isCustom: true },
  { name: "FacebookIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "f", isCustom: true },
  { name: "TwitterIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "X", isCustom: true },
  { name: "LinkedInIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "in", isCustom: true },
  { name: "InstagramIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "IG", isCustom: true },
  { name: "OriginalInstagramIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "IG", isCustom: true },
  { name: "OriginalTikTokIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "TT", isCustom: true },
  { name: "OriginalYouTubeIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "YT", isCustom: true },
  { name: "SoundwaveIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "~", isCustom: true },
  { name: "USFlagIcon", category: "Social, Payment, & Brand Icons", url: "", customText: "🇺🇸", isCustom: true },
  
  // Service & Platform Icons
  { name: "InstagramServicesIcon", category: "Service & Platform Icons", url: "", customText: "IG", isCustom: true },
  { name: "FollowersIcon", category: "Service & Platform Icons", url: "", iconType: "faUser" },
  { name: "LikesIcon", category: "Service & Platform Icons", url: "", iconType: "faHeart" },
  { name: "ViewsIcon", category: "Service & Platform Icons", url: "", iconType: "faEye" },
  { name: "AutomaticLikesIcon", category: "Service & Platform Icons", url: "", iconType: "faHeart" },
  { name: "TikTokFollowersIcon", category: "Service & Platform Icons", url: "", iconType: "faUser" },
  { name: "TikTokViewsIcon", category: "Service & Platform Icons", url: "", iconType: "faEye" },
  { name: "YouTubeSubscribersIcon", category: "Service & Platform Icons", url: "", iconType: "faUser" },
  { name: "YouTubeLikesIcon", category: "Service & Platform Icons", url: "", iconType: "faThumbsUp" },
  { name: "YouTubeViewsIcon", category: "Service & Platform Icons", url: "", iconType: "faEye" },
  { name: "RocketLaunchIcon", category: "Service & Platform Icons", url: "", iconType: "faFire" },
  { name: "InstagramLikesShortcutIcon", category: "Service & Platform Icons", url: "", iconType: "faHeart" },
  { name: "InstagramViewsShortcutIcon", category: "Service & Platform Icons", url: "", iconType: "faEye" },
  { name: "InstagramFollowersShortcutIcon", category: "Service & Platform Icons", url: "", iconType: "faUser" },
  { name: "TikTokLikesShortcutIcon", category: "Service & Platform Icons", url: "", iconType: "faHeart" },
  { name: "TikTokFollowersShortcutIcon", category: "Service & Platform Icons", url: "", iconType: "faUser" },
  { name: "YouTubeLikesShortcutIcon", category: "Service & Platform Icons", url: "", iconType: "faThumbsUp" },
  { name: "YouTubeSubscribersShortcutIcon", category: "Service & Platform Icons", url: "", iconType: "faUser" },
  { name: "YouTubeViewsShortcutIcon", category: "Service & Platform Icons", url: "", iconType: "faEye" },
];

async function seed() {
  console.log('Seeding via API...');
  
  for (const icon of defaultIcons) {
    try {
      const body = {
        name: icon.name,
        category: icon.category,
        url: icon.url || '',
        alt: icon.customText || icon.name,
      };

      const res = await fetch('http://localhost:3000/api/cms/icons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-seed-secret': 'temp-secret-123'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`Failed to create ${icon.name}: ${res.status} ${text}`);
      } else {
        console.log(`Created/Checked ${icon.name}`);
      }
    } catch (err) {
      console.error(`Error processing ${icon.name}:`, err.message);
    }
  }
  console.log('Done.');
}

seed();
