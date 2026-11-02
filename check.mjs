// Opens the app, goes to the fetcher page by client-side navigation, and
// checks whether the effect saw the token that the page rendered.
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const RUNS = Number(process.env.RUNS ?? 10);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
let failed = 0;
for (let i = 1; i <= RUNS; i++) {
  const page = await browser.newPage();
  await page.goto(BASE);
  await page.getByRole("link", { name: "fetcher page" }).click();
  await page.waitForFunction(() => document.querySelector("#rendered")?.textContent !== "none");
  await page.waitForTimeout(500);
  const rendered = await page.textContent("#rendered");
  const effect = await page.textContent("#effect");
  const ok = rendered === effect;
  if (!ok) failed++;
  console.log(`run ${i}: ${ok ? "ok  " : "BUG "} rendered=${rendered} effect=${effect}`);
  await page.close();
}
await browser.close();
console.log(`${failed}/${RUNS} runs: the effect never saw the rendered token`);
process.exitCode = failed > 0 ? 1 : 0;
