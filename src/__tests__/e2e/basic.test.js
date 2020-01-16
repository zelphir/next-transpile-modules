const BASE_URL = 'http://localhost:3000';

describe('homepage access', () => {
  test('homepage should be correctly displayed', async () => {
    const page = await browser.newPage();
    const response = await page.goto(`${BASE_URL}/`);

    if (!response) throw new Error('Could not access the page');

    expect(response.status()).toBe(200);

    const content = await page.$eval('h1', (e) => e.textContent);
    expect(content).toBe('Hello World');
  });
});

describe('local-module transpilation', () => {
  test('pages using transpiled modules should be correctly displayed', async () => {
    const page = await browser.newPage();
    const response = await page.goto(`${BASE_URL}/test-local-module`);

    if (!response) throw new Error('Could not access the page');

    expect(response.status()).toBe(200);

    const content = await page.$eval('h1', (e) => e.textContent);
    expect(content).toBe('The answer is 42');
  });
});

describe('local-typescript-module transpilation', () => {
  test('pages using transpiled modules should be correctly displayed', async () => {
    const page = await browser.newPage();
    const response = await page.goto(`${BASE_URL}/test-local-typescript-module`);

    if (!response) throw new Error('Could not access the page');

    expect(response.status()).toBe(200);

    const content = await page.$eval('h1', (e) => e.textContent);
    expect(content).toBe('The answer is 43');
  });
});

describe('npm-module transpilation', () => {
  test('pages using transpiled modules should be correctly displayed', async () => {
    const page = await browser.newPage();
    const response = await page.goto(`${BASE_URL}/test-npm-module`);

    if (!response) throw new Error('Could not access the page');

    expect(response.status()).toBe(200);

    const content = await page.$eval('h1', (e) => e.textContent);
    expect(content).toBe('The answer is 44');
  });
});

describe('css-module transpilation', () => {
  test('pages using transpiled modules should be correctly displayed', async () => {
    const page = await browser.newPage();
    const response = await page.goto(`${BASE_URL}/test-css-module`);

    if (!response) throw new Error('Could not access the page');

    expect(response.status()).toBe(200);

    const content = await page.$eval('button', (e) => e.textContent);
    expect(content).toBe('Styled button');

    const el = await page.$('button');
    const className = await el.getProperty('className');

    expect(className.includes('Button_error__')).toBe(true);
  });
});
