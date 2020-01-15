const localModuleAppPath = 'src/__tests__/__apps__/local-module';
const localModuleTypescriptAppPath = 'src/__tests__/__apps__/local-module-typescript';
const npmModuleTypescriptAppPath = 'src/__tests__/__apps__/npm-module';

module.exports = {
  launch: {
    headless: true,
    slowMo: false,
    devtools: true
  },
  server: [
    {
      command: `npm run build --prefix=${localModuleAppPath} && npm run start --prefix=${localModuleAppPath}`,
      launchTimeout: 50000,
      port: 3000
    },
    {
      command: `npm run build --prefix=${localModuleTypescriptAppPath} && npm run start --prefix=${localModuleTypescriptAppPath} -- --port 3001`,
      launchTimeout: 50000,
      port: 3001
    },
    {
      command: `npm run build --prefix=${localModuleTypescriptAppPath} && npm run start --prefix=${localModuleTypescriptAppPath} -- --port 3002`,
      launchTimeout: 50000,
      port: 3002
    }
  ]
};
