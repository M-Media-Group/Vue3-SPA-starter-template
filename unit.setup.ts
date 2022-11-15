// See also the vitest.config.ts file
import { config } from "@vue/test-utils";
import { SUPPORT_LOCALES } from "./src/locales/i18n";

config.global.mocks = {
  $t: (tKey) => tKey, // just return translation key
  $i18n: {
    locale: SUPPORT_LOCALES[0],
    availableLocales: SUPPORT_LOCALES,
    fallbackLocale: SUPPORT_LOCALES[0],
  },
  navIsLoading: false,
};
