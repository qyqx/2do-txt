import { expect, test } from "@playwright/test";
import { readFileSync } from "fs";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Onboarding", () => {
  test("should show the onboarding header", async ({ page }) => {
    await expect(page.locator("text=Get Started").first()).toBeVisible();
  });
});

test.describe("New file", () => {
  test("should allow me to create a new file and add a task", async ({
    page,
  }) => {
    await page.locator("button[aria-label='Create task']").click();

    await expect(page.locator("input[aria-label='File name']")).toHaveValue(
      "todo.txt"
    );

    await page.locator("button[aria-label='Create file']").click();

    await expect(page).toHaveURL("http://localhost:3000/?active=todo.txt");

    await expect(page.locator("div[aria-label='Text editor']")).toBeFocused();

    await page.type(
      "div[aria-label='Text editor']",
      "Play soccer with friends @Private"
    );

    await page.locator('div[role="option"]:has-text("Add Private")').click();

    await page.locator("button[aria-label='Save task']").click();
  });
});

test.describe("File import", () => {
  // webkit: Selecting multiple files does not work in the test
  // eslint-disable-next-line jest/valid-title
  test.skip(({ browserName }) => browserName === "webkit");

  test("should allow me to import files", async ({ page }) => {
    const content = readFileSync("resources/todo.txt");

    await expect(page.locator("text=Import todo.txt")).toBeVisible();

    await page.setInputFiles("input#file-picker", {
      name: "todo1.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(content),
    });

    await expect(page.locator("button[aria-label='File menu']")).toHaveText(
      "todo1.txt"
    );

    await page.setInputFiles("input#file-picker", {
      name: "todo2.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(content),
    });

    await expect(page.locator("button[aria-label='File menu']")).toHaveText(
      "todo2.txt"
    );

    await page.locator('button:has-text("todo2.txt")').click();

    await page.locator("text=All").click();

    await expect(page.locator("[aria-label='Task']")).toHaveCount(16);
  });
});