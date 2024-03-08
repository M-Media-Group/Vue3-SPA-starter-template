import { waitForPageReady, type TestRunnerConfig, getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

/**
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
   setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    await waitForPageReady(page);
    await page.waitForLoadState('domcontentloaded'); // Wait for the 'DOMContentLoaded' event.

    const storyContext = await getStoryContext(page, context);

    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules,
    });

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });

    // Take a screenshot of the page
    const screenshot = await page.screenshot({
      // We disable the animations because they can cause flakiness in the screenshots, and we aren't waiting for them to finish after each relevant action
      animations: "disabled",
    });
    // Compare the screenshot to a reference image
     expect(screenshot).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
      // Allow a small amount of pixels (up to 1%) to be different. This is for spinner animations and other dynamic content
      failureThreshold: 0.015,
      failureThresholdType: 'percent',
     });
  },
};

export default config;