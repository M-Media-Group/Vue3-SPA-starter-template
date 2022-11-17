// See also the vitest.config.ts file
import { config } from "@vue/test-utils";
import { setupI18n } from "./src/locales/i18n";

config.global.mocks = {
  navIsLoading: false,
};

const i18n = setupI18n();
config.global.plugins = [i18n];
