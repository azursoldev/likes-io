"use client";

import React, { createContext, useContext } from "react";

type Settings = {
  headerLogoUrl?: string | null;
  footerLogoUrl?: string | null;
  faviconUrl?: string | null;
  homeMetaTitle?: string | null;
  homeMetaDescription?: string | null;
  // Add other settings as needed
};

const SettingsContext = createContext<Settings>({});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: Settings;
}) => {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
