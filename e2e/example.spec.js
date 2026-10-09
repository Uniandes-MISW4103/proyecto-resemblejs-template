import { test } from "@playwright/test";
import fs from "fs";
import { PNG } from "pngjs";
import { createRequire } from "module";
import vrtConfig from "../vrt.config.json" with { type: "json" };
import abp from "../abp.cjs";

const require = createRequire(import.meta.url);
const compareImages = require("resemblejs/compareImages");

// Example on an external demo (not the application under test): the registration page before and
// after filling it with the administrator credentials of the repository's .env. In the project,
// compare the same page in the two versions of the application (abp.ABP_URL and abp.ABP_RC_URL).
const { url: PAGE_URL, options } = vrtConfig;
const [firstName, ...lastName] = abp.ABP_ADMIN_NAME.split(" ");

test.describe("registration", () => {
  let beforePath = "";
  let afterPath = "";
  let comparePath = "";
  let resultPath = "";

  test.beforeAll(async ({ browserName }, testInfo) => {
    beforePath = testInfo.outputPath(`before-${browserName}.png`);
    afterPath = testInfo.outputPath(`after-${browserName}.png`);
    comparePath = testInfo.outputPath(`compare-${browserName}.png`);
    resultPath = testInfo.outputPath(`result-${browserName}.json`);
  });

  test("vrt", async ({ page, browserName }) => {
    await page.goto(PAGE_URL);
    // StackBlitz shows a button that starts the demo before showing it.
    await page.getByRole("button").click();
    await page.locator('input[formcontrolname="username"]').waitFor();
    await page.screenshot({ path: beforePath });

    await page.locator('input[formcontrolname="firstName"]').fill(firstName);
    await page.locator('input[formcontrolname="lastName"]').fill(lastName.join(" "));
    await page.locator('input[formcontrolname="username"]').fill(abp.ABP_ADMIN_EMAIL);
    await page.locator('input[formcontrolname="password"]').fill(abp.ABP_ADMIN_PASSWORD);
    await page.screenshot({ path: afterPath });

    const img1 = PNG.sync.read(fs.readFileSync(beforePath));
    const img2 = PNG.sync.read(fs.readFileSync(afterPath));

    const data = await compareImages(img1, img2, options);
    const resultData = {
      isSameDimensions: data.isSameDimensions,
      dimensionDifference: data.dimensionDifference,
      rawMisMatchPercentage: data.rawMisMatchPercentage,
      misMatchPercentage: data.misMatchPercentage,
      diffBounds: data.diffBounds,
      analysisTime: data.analysisTime,
    };

    fs.writeFileSync(comparePath, data.getBuffer());
    fs.writeFileSync(resultPath, JSON.stringify(resultData, null, 2));
  });

  test.afterAll(async ({ browserName }) => {
    if (fs.existsSync(resultPath)) {
      const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
      console.log(`[${browserName}] VRT completed. Mismatch: ${result.misMatchPercentage}`);
    }
  });
});
