<script setup lang="ts">
import WelcomeItem from "./WelcomeItem.vue";
import DocumentationIcon from "./icons/IconDocumentation.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import EcosystemIcon from "./icons/IconEcosystem.vue";
import CommunityIcon from "./icons/IconCommunity.vue";
import SupportIcon from "./icons/IconSupport.vue";
import BaseButton from "./BaseButton.vue";
import ConfirmsPaymentMethod from "./modals/ConfirmsPaymentMethod.vue";
import ConfirmsMiddleware from "./modals/ConfirmsMiddleware.vue";

const handleAuthenticated = () => {
  // Redirect to the home page
  alert("action here");
};

const handlePaymentOk = () => {
  alert("action here on ok payment");
};

const attemptOk = (success: () => any, fail: () => any, shouldPass: any) => {
  return shouldPass ? success() : fail();
};
</script>

<template>
  <ConfirmsMiddleware
    :title="$t('Confirm your email')"
    :middleware="['auth', 'confirmedPassword']"
    @confirmed="handleAuthenticated"
  >
    <BaseButton>Force unconfirmed email</BaseButton>

    <template #confirmationElement:confirmedPassword="{ success, fail }">
      <p>
        {{
          $t(
            "Please confirm your email address to continue. Check your spam too. If you didn't get an email, you can ask us to send you a new one."
          )
        }}
      </p>
      <BaseButton @click="attemptOk(success, fail, false)">Fail</BaseButton>
      <BaseButton @click="attemptOk(success, fail, true)">Ok</BaseButton>
    </template>
  </ConfirmsMiddleware>

  <ConfirmsMiddleware
    :title="$t('Connect')"
    :middleware="['auth', 'confirmedPassword']"
    @confirmed="handleAuthenticated"
  >
    <BaseButton>Do action when authed</BaseButton>
  </ConfirmsMiddleware>

  <ConfirmsPaymentMethod @confirmed="handlePaymentOk">
    <template v-slot="{ isConfirming }">
      <BaseButton :aria-busy="isConfirming"
        >Do action when payment method confirmed
      </BaseButton>
    </template>
  </ConfirmsPaymentMethod>

  <ConfirmsMiddleware
    :title="$t('Confirm your password')"
    middleware="confirmedPassword"
    @confirmed="handleAuthenticated"
  >
    <BaseButton>Do action when authed</BaseButton>
  </ConfirmsMiddleware>

  <!-- Nesting these modals doesnt "really" work -->
  <!-- <ConfirmsAuthenticated @confirmed="handleAuthenticated">
    <ConfirmsPaymentMethod @confirmed="handlePaymentOk">
      <BaseButton>
        Do action when payment method confirmed and authed</BaseButton
      >
    </ConfirmsPaymentMethod>
  </ConfirmsAuthenticated> -->

  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Vue’s
    <a href="https://vuejs.org/" target="_blank" rel="noopener"
      >official documentation</a
    >
    provides you with all information you need to get started.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>

    This project is served and bundled with
    <a
      href="https://vitejs.dev/guide/features.html"
      target="_blank"
      rel="noopener"
      >Vite</a
    >. The recommended IDE setup is
    <a href="https://code.visualstudio.com/" target="_blank" rel="noopener"
      >VSCode</a
    >
    +
    <a
      href="https://github.com/johnsoncodehk/volar"
      target="_blank"
      rel="noopener"
      >Volar</a
    >. If you need to test your components and web pages, check out
    <a href="https://www.cypress.io/" target="_blank" rel="noopener">Cypress</a>
    and
    <a href="https://on.cypress.io/component" target="_blank"
      >Cypress Component Testing</a
    >.

    <br />

    More instructions are available in <code>README.md</code>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>

    Get official tools and libraries for your project:
    <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener">Pinia</a>,
    <a href="https://router.vuejs.org/" target="_blank" rel="noopener"
      >Vue Router</a
    >,
    <a href="https://test-utils.vuejs.org/" target="_blank" rel="noopener"
      >Vue Test Utils</a
    >, and
    <a href="https://github.com/vuejs/devtools" target="_blank" rel="noopener"
      >Vue Dev Tools</a
    >. If you need more resources, we suggest paying
    <a
      href="https://github.com/vuejs/awesome-vue"
      target="_blank"
      rel="noopener"
      >Awesome Vue</a
    >
    a visit.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Got stuck? Ask your question on
    <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a
    >, our official Discord server, or
    <a
      href="https://stackoverflow.com/questions/tagged/vue.js"
      target="_blank"
      rel="noopener"
      >StackOverflow</a
    >. You should also subscribe to
    <a href="https://news.vuejs.org" target="_blank" rel="noopener"
      >our mailing list</a
    >
    and follow the official
    <a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
      >@vuejs</a
    >
    twitter account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its
    sustainability. You can help us by
    <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener"
      >becoming a sponsor</a
    >.
  </WelcomeItem>
</template>
