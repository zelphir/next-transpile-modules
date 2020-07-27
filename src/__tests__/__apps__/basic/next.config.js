const withTM = require('./lib/next-transpile-modules')(['shared', 'shared-ts', 'shared-ui', 'lodash-es']);

module.exports = withTM({});
