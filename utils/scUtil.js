const puppeteer = require('puppeteer');
const key = require('ckey');
const path = require('path');
const {authenticator} = require('otplib');

const otpGenerator = secretKey => {
  const token = authenticator.generate(secretKey);
  return token;
};

const signIn = async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 20});
  const page = await browser.newPage();

  const email = key.SC_USERNAME
  const password = key.SC_PASSWORD
  const secretValue = key.SC_TOKEN

  await page.setDefaultTimeout(0);
  await page.goto('https://sellercentral.amazon.com/');

  await page.waitForSelector('#login > div > a > strong');
  await page.click('#login > div > a > strong');
  await page.waitForSelector('#ap_email');
  await page.type('#ap_email', email);
  await page.type('#ap_password', password);
  await page.click('#signInSubmit');

  const otpCode = otpGenerator(secretValue);
  await page.waitForSelector('#auth-mfa-otpcode');
  await page.type('#auth-mfa-otpcode', otpCode);
  await page.click('#auth-signin-button');

  await page.waitForSelector('#picker-container > div > div.picker-body > div > div:nth-child(3) > div > div:nth-child(3) > button > div > div')
  await page.click('#picker-container > div > div.picker-body > div > div:nth-child(3) > div > div:nth-child(3) > button > div > div');
  await page.click('#picker-container > div > div.picker-footer > div > button');

  return { browser };
};

module.exports = { signIn };
