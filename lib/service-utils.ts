/**
 * Maps service name to platform and serviceType
 */
export function getServiceMapping(serviceName: string): { platform: string; serviceType: string } | null {
  const lowerName = serviceName.toLowerCase();
  
  // Instagram services
  if (lowerName.includes("instagram")) {
    if (lowerName.includes("like")) {
      return { platform: "instagram", serviceType: "likes" };
    }
    if (lowerName.includes("follower")) {
      return { platform: "instagram", serviceType: "followers" };
    }
    if (lowerName.includes("view")) {
      return { platform: "instagram", serviceType: "views" };
    }
  }
  
  // TikTok services
  if (lowerName.includes("tiktok")) {
    if (lowerName.includes("like")) {
      return { platform: "tiktok", serviceType: "likes" };
    }
    if (lowerName.includes("follower")) {
      return { platform: "tiktok", serviceType: "followers" };
    }
    if (lowerName.includes("view")) {
      return { platform: "tiktok", serviceType: "views" };
    }
  }
  
  // YouTube services
  if (lowerName.includes("youtube")) {
    if (lowerName.includes("view")) {
      return { platform: "youtube", serviceType: "views" };
    }
    if (lowerName.includes("subscriber")) {
      return { platform: "youtube", serviceType: "subscribers" };
    }
    if (lowerName.includes("like")) {
      return { platform: "youtube", serviceType: "likes" };
    }
  }
  
  return null;
}


