const basicAppPath = 'src/__tests__/__apps__/basic';
const webpack5AppPath = 'src/__tests__/__apps__/webpack-5';
const yarnWorkspacesAppPath = 'src/__tests__/__apps__/yarn-workspaces/app';

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
      command: `npm run build --prefix=${webpack5AppPath} && npm run start --prefix=${webpack5AppPath} -- --port 3001`,
      launchTimeout: 50000,
      port: 3001
    },
    {
      command: `npm run build --prefix=${yarnWorkspacesAppPath} && npm run start --prefix=${yarnWorkspacesAppPath} -- --port 3002`,
      launchTimeout: 50000,
      port: 3002
    }
  ]
};
