"use client";

import { createContext, useContext } from "react";
import { lp, type Locale } from "./locales";
import { ui } from "./ui";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
export const useUi = () => ui[useLocale()];
export function useLp() {
  const locale = useLocale();
  return (path: string) => lp(locale, path);
}
