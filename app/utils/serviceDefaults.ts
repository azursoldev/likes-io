
export const getDefaultMoreServicesButtons = (platform: string) => {
  const p = platform?.toLowerCase() || "";
  
  if (p === 'tiktok') {
    return [
      { href: "/buy-tiktok-likes", label: "BUY TIKTOK LIKES", iconName: "heart" },
      { href: "/buy-tiktok-followers", label: "BUY TIKTOK FOLLOWERS", iconName: "user" }
    ];
  }
  
  if (p === 'instagram') {
    return [
      { href: "/buy-instagram-followers", label: "BUY FOLLOWERS", iconName: "user" },
      { href: "/buy-instagram-likes", label: "BUY LIKES", iconName: "heart" }
    ];
  }
  
  if (p === 'youtube') {
    return [
      { href: "/buy-youtube-views", label: "BUY YOUTUBE VIEWS", iconName: "play" },
      { href: "/buy-youtube-subscribers", label: "BUY YOUTUBE SUBSCRIBERS", iconName: "user" }
    ];
  }

  if (p === 'spotify') {
     return [
       { href: "/buy-spotify-plays", label: "BUY SPOTIFY PLAYS", iconName: "play" },
       { href: "/buy-spotify-followers", label: "BUY SPOTIFY FOLLOWERS", iconName: "user" }
     ];
  }

  // Default fallback
  return [
    { href: "/buy-instagram-followers", label: "BUY FOLLOWERS", iconName: "user" },
    { href: "/buy-instagram-views", label: "BUY VIEWS", iconName: "eye" }
  ];
};
