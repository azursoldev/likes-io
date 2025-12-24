"use client";

import { useState, useEffect } from 'react';

type ServiceMap = Record<string, string>;

export function useNavigation() {
  const [serviceMap, setServiceMap] = useState<ServiceMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        const res = await fetch('/api/navigation');
        if (res.ok) {
          const data = await res.json();
          setServiceMap(data.serviceMap || {});
        }
      } catch (error) {
        console.error('Failed to fetch navigation:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNavigation();
  }, []);

  const getLink = (platform: string, serviceType: string) => {
    const key = `${platform.toLowerCase()}-${serviceType.toLowerCase()}`;
    const slug = serviceMap[key];
    if (slug) {
      return `/${slug}`;
    }
    return `/${platform.toLowerCase()}/${serviceType.toLowerCase()}`;
  };

  return { getLink, loading };
}
