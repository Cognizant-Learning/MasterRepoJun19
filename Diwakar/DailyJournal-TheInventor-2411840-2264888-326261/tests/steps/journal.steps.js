// steps/journal.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the Journal page', async function () {
  await this.page.goto('/journal');
});

When('I enter {string} in the journal entry field', async function (entryText) {
  await this.page.fill('textarea[placeholder="Write your journal entry..."]', entryText);
});

When('I select the mood {string}', async function (mood) {
  await this.page.selectOption('#mood-select', mood);
});

When('I click the {string} button', async function (buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
});

Then('I should see the entry {string} in the list', async function (entryText) {
  await expect(this.page.locator('li')).toContainText(entryText);
});

Then('I should see the mood emoji {string} for the entry {string}', async function (emoji, entryText) {
  const entry = this.page.locator('li', { hasText: entryText });
  await expect(entry).toContainText(emoji);
});

Given('I have added a journal entry {string} with mood {string}', async function (entryText, mood) {
  await this.page.goto('/journal');
  await this.page.fill('textarea[placeholder="Write your journal entry..."]', entryText);
  await this.page.selectOption('#mood-select', mood);
  await this.page.click('button:has-text("Add Entry")');
});

When('I click the {string} button for the entry {string}', async function (buttonText, entryText) {
  const entry = this.page.locator('li', { hasText: entryText });
  await entry.locator(`button:has-text("${buttonText}")`).click();
});

Then('I should not see the entry {string} in the list', async function (entryText) {
  await expect(this.page.locator('li')).not.toContainText(entryText);
});

Given('I have added journal entries with moods {string}, {string}, and {string}', async function (mood1, mood2, mood3) {
  await this.page.goto('/journal');
  for (const [i, mood] of [[1, mood1], [2, mood2], [3, mood3]]) {
    await this.page.fill('textarea[placeholder="Write your journal entry..."]', `Entry ${i}`);
    await this.page.selectOption('#mood-select', mood);
    await this.page.click('button:has-text("Add Entry")');
  }
});

Then('the overall mood should be {string} ({string})', async function (emoji, mood) {
  await expect(this.page.locator('div')).toContainText(emoji);
  await expect(this.page.locator('div')).toContainText(mood);
});

Given('I have added more than 10 journal entries with mood {string}', async function (mood) {
  await this.page.goto('/journal');
  for (let i = 1; i <= 12; i++) {
    await this.page.fill('textarea[placeholder="Write your journal entry..."]', `Entry ${i}`);
    await this.page.selectOption('#mood-select', mood);
    await this.page.click('button:has-text("Add Entry")');
  }
});

Then('the journal entries list should be scrollable', async function () {
  const list = await this.page.locator('ul');
  const isScrollable = await list.evaluate(el => el.scrollHeight > el.clientHeight);
  if (!isScrollable) throw new Error('Journal entries list is not scrollable when it should be.');
});

Then('the header and main content should have the same width', async function () {
  // Check the header (h2) and main container widths
  const main = await this.page.locator('div').first();
  const header = await this.page.locator('h2');
  const mainWidth = await main.evaluate(el => el.offsetWidth);
  const headerWidth = await header.evaluate(el => el.offsetWidth);
  if (Math.abs(mainWidth - headerWidth) > 2) throw new Error('Header and main content widths do not match.');
});
