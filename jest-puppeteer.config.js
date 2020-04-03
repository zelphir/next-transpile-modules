const localModuleAppPath = 'src/__tests__/__apps__/basic';

module.exports = {
  launch: {
    headless: true,
    slowMo: false,
    devtools: true,
  },
  server: [
    {
      command: `npm run build --prefix=${localModuleAppPath} && npm run start --prefix=${localModuleAppPath}`,
      launchTimeout: 50000,
      port: 3000,
    },
  ],
};
