# Vue3 starter kit

Arguably the most important parts of an app (authentication and handling payment methods) are also the most repetitive and boring to implement. This starter kit aims to solve that problem by providing a solid foundation for your next Vue3 app.

![Screenshot](screenshot.png)

## Features
- Highly performant and flexible
- Widely tested with Unit and E2E tests
  - Includes Github Actions for CI running both types of tests
  - Includes all fixtures and mocks needed for testing
  - Includes unit-test coverage reports
- Doesn't force any CSS frameworks (HTML written semantically and tests use semantic selectors), but comes with Pico CSS for a quick start
  - Supports Dark Mode
  - Only 8 classes currently used (rest relies on semantic selectors) so super easy to replace
- Written with Composition API in Vue3 and Typescript
- Support for Pinia with a pre-made User store, Vue Router, Vue i18n, and Axios
- Comes with internationalization support out of the box (English and French to start with)
- Includes a Dev-Container for development in a Docker environment (optional)
- Login, logout, register pages
- Forgot password, reset password, resend email confirmation, password confirmation, payment method adding pages
- CSRF cookie protection support
- User settings page with a section to add payment methods using Stripe Elements
- Base form component using native HTML5 validation (set custom errors on inputs and then have the browser handle them natively with `setCustomValidity`)
- Semantic HTML5 elements
- Middleware for VueRouter including: auth, guest, confirmedEmail, confirmedPassword, hasPaymentMethod
- Auto meta-tags handling for SEO
  - Includes Facebook and Twitter meta tags (Open Graph and Twitter Cards respectively)
- Auto schema markup generation (at least the basics)
- Content-Security-Policy (CSP) support
- All API calls in a single file for easy customization (the User store)
- BaseButton component that automatically renders a `button`, `a` with a role of `button`, or `router-link` depending on the props passed (if href its an `a`, if to its a `router-link`, otherwise its a `button`)
- Global event bus for easy communication with things like Analytics services
- Netlify TOML file for easy deployment on Netlify

## Project Setup

```sh
npm install
```

Make sure to copy the `.env.example` to `.env.local` and fill in the values.

After installing everything - you should run the E2E tests to make sure everything is working properly. See the [E2E tests section](#run-end-to-end-tests-with-cypress) for more information.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Backend setup

This starter kit was designed to work with a Laravel based backend, but any backend that implements the required functionality would work.

Assumptions made by this starter kit:
- The backend is powered by Laravel Fortify and Sanctum
  - Check out our complementary [Laravel-SPA package](https://packagist.org/packages/mmedia/laravel-spa) that sets up some backend stuff for you
  - You should still setup Cashier and the routes for `user/payment-methods` and `user/payment-intent` yourself; see the User store for details
- The user object is the one that can make payments (some apps may need to do this on team models or other models instead)
  - Using Stripe as the payment provider
  - Using Pico CSS variables for styling. You do not need to use Pico, but if you change it you might have to update some CSS variables especially ones passed to Stripe Elements

## Contributing

### Test driven approach

We use a test driven approach for this starter kit.

You should almost never modify existing tests. Any modified tests will require merge approval.

If you find a bug, first write a test that will fail because of the bug. Then fix the bug and make sure the test passes.

If you want to add a new feature, write a test that will fail because of the missing feature. Then add the feature and make sure the test passes. New tests do not require approval.

<!-- Show image https://res.cloudinary.com/practicaldev/image/fetch/s--2bUj5oX1--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/26tdj40bmlnmw09fb27h.png -->