describe('local-module end-to-end test', () => {
  const BASE_URL = 'http://localhost:3001';

  describe('ssr', () => {
    test('homepage should be correctly displayed', async () => {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE_URL}/`);

      if (!response) throw new Error('Could not access the page');

      expect(response.status()).toBe(200);

      const content = await page.$eval('h1', (e) => e.textContent);
      expect(content).toBe('Hello World');
    });

    test('pages using transpiled modules should be correctly displayed', async () => {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE_URL}/test`);

      if (!response) throw new Error('Could not access the page');

      expect(response.status()).toBe(200);

      const content = await page.$eval('h1', (e) => e.textContent);
      expect(content).toBe('The answer is 42');
    });
  });
});
