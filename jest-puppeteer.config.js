const basicAppPath = 'src/__tests__/__apps__/basic';
const withTypescriptAppPath = 'src/__tests__/__apps__/with-typescript';

module.exports = {
  launch: {
    headless: true,
    slowMo: false,
    devtools: true
  },
  server: [
    {
      command: `npm run build --prefix=${basicAppPath} && npm run start --prefix=${basicAppPath}`,
      launchTimeout: 50000,
      port: 3000
    },
    {
      command: `npm run build --prefix=${withTypescriptAppPath} && npm run start --prefix=${withTypescriptAppPath} -- --port 3001`,
      launchTimeout: 50000,
      port: 3001
    }
  ]
};
