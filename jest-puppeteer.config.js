const basicAppPath = 'src/__tests__/__apps__/basic';
const yarnWorkspacesAppPath = 'src/__tests__/__apps__/yarn-workspaces/app';
const webpack5AppPath = 'src/__tests__/__apps__/webpack-5';

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
      command: `yarn --cwd ${yarnWorkspacesAppPath} run build  && yarn --cwd ${yarnWorkspacesAppPath} run start -- --port 3001`,
      launchTimeout: 50000,
      port: 3001
    },
    {
      command: `yarn --cwd ${webpack5AppPath} run build  && yarn --cwd ${webpack5AppPath} run start -- --port 3002`,
      launchTimeout: 50000,
      port: 3002
    }
  ]
};
