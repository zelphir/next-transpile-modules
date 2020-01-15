describe('basic end-to-end test', () => {
  const BASE_URL = 'http://localhost:3000';

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

  // describe('client-side navigation', () => {
  //   test('should display the 200 page correctly', async () => {
  //     const page = await browser.newPage();
  //     const response = await page.goto(`${BASE_URL}/`);

  //     if (!response) throw new Error('Could not access the page');

  //     await page.click('a#link-200');

  //     const content = await page.$eval('h1', (e) => e.textContent);
  //     expect(content).toBe('Post page');
  //   });

  //   test('should display the 404 page correctly', async () => {
  //     const page = await browser.newPage();
  //     const response = await page.goto(`${BASE_URL}/`);

  //     if (!response) throw new Error('Could not access the page');

  //     await page.click('a#link-404');

  //     const content = await page.$eval('h2', (e) => e.textContent);
  //     expect(content).toBe('This page could not be found.');
  //   });

  //   test('should display the 500 page correctly', async () => {
  //     const page = await browser.newPage();
  //     const response = await page.goto(`${BASE_URL}/`);

  //     if (!response) throw new Error('Could not access the page');

  //     await page.click('a#link-500');

  //     const content = await page.$eval('h2', (e) => e.textContent);
  //     expect(content).toBe('Internal Server Error.');
  //   });
  // });
});
