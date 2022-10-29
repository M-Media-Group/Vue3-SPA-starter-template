// See also the vitest.config.ts file
import { config } from "@vue/test-utils";

config.global.mocks = {
    $t: (tKey) => tKey, // just return translation key
    $i18n: {
        locale: "en",
        availableLocales: ["en"],
        fallbackLocale: "en",
    },
};
