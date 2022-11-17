// See also the vitest.config.ts file
import { RouterLinkStub, config } from "@vue/test-utils";
import { setupI18n } from "./src/locales/i18n";

config.global.mocks = {
  navIsLoading: false,
};

config.global.stubs = {
  RouterLink: RouterLinkStub,
};

const i18n = setupI18n();
config.global.plugins = [i18n];
