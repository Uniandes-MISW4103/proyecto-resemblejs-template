import { test } from "@playwright/test";
import fs from "fs";
import { PNG } from "pngjs";
import { createRequire } from "module";
import vrtConfig from "../vrt.config.json" with { type: "json" };

const require = createRequire(import.meta.url);
const compareImages = require("resemblejs/compareImages");

const { options } = vrtConfig;

test.describe("color-palette", () => {
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
    await page.goto("/color-palette");
    await page.screenshot({ path: beforePath });

    await page.click("#generate");
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
