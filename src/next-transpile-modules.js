const path = require('path');
const resolve = require('resolve');

// Use me when needed
// const inspect = (object) => {
//   console.log(util.inspect(object, { showHidden: false, depth: null }));
// };

/**
 * Check if two regexes are equal
 * Stolen from https://stackoverflow.com/questions/10776600/testing-for-equality-of-regular-expressions
 *
 * @param {RegExp} x
 * @param {RegExp} y
 */
const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

/**
 *
 * @param {string[]} modules
 */
const generateMatcher = (modules) => {
  const resolvedModules = modules
    .map((module) => {
      const resolved = resolve.sync(module);

      if (!resolved)
        throw new Error(
          `next-transpile-modules: could not resolve module "${module}". Are you sure the name of the module you are trying to transpile is correct?`
        );

      return resolved;
    })
    .map(path.dirname);

  const matcher = (path) => resolvedModules.some((modulePath) => path.includes(modulePath));

  return matcher;
};

/**
 * Actual Next.js plugin
 */
const withTmInitializer = (modules = [], options = {}) => {
  const withTM = (nextConfig = {}) => {
    if (modules.length === 0) return nextConfig;

    const resolveSymlinks = options.resolveSymlinks || false;
    const isWebpack5 = options.unstable_webpack5 || false;

    const matcher = generateMatcher(modules);
    const unmatcher = (path) => !matcher(path);

    const externalHasInclude = (context, request) => matcher(path.resolve(context, request));

    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        // Safecheck for Next < 5.0
        if (!options.defaultLoaders) {
          throw new Error(
            'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
          );
        }

        // Avoid Webpack to resolve transpiled modules path to their real path as
        // we want to test modules from node_modules only. If it was enabled,
        // modules in node_modules installed via symlink would then not be
        // transpiled.
        config.resolve.symlinks = resolveSymlinks;

        // Since Next.js 8.1.0, config.externals is undefined
        if (config.externals) {
          config.externals = config.externals.map((external) => {
            if (typeof external !== 'function') return external;

            if (isWebpack5)
              return ({ context, request }, cb) => {
                return externalHasInclude(context, request) ? cb() : external({ context, request }, cb);
              };

            return (context, request, cb) => {
              return externalHasInclude(context, request) ? cb() : external(context, request, cb);
            };
          });
        }

        // Add a rule to include and parse all modules (js & ts)
        if (isWebpack5) {
          config.module.rules.push({
            test: /\.+(js|jsx|mjs|ts|tsx)$/,
            use: options.defaultLoaders.babel,
            include: matcher,
          });
        } else {
          config.module.rules.push({
            test: /\.+(js|jsx|mjs|ts|tsx)$/,
            loader: options.defaultLoaders.babel,
            include: matcher,
          });
        }

        // Support CSS modules + global in node_modules
        // TODO ask Next.js maintainer to expose the css-loader via defaultLoaders
        const nextCssLoaders = config.module.rules.find((rule) => typeof rule.oneOf === 'object');

        // .module.css
        if (nextCssLoaders) {
          const nextCssLoader = nextCssLoaders.oneOf.find(
            (rule) => rule.sideEffects === false && regexEqual(rule.test, /\.module\.css$/)
          );

          const nextSassLoader = nextCssLoaders.oneOf.find(
            (rule) => rule.sideEffects === false && regexEqual(rule.test, /\.module\.(scss|sass)$/)
          );

          if (nextCssLoader) {
            nextCssLoader.issuer.or = nextCssLoader.issuer.and ? nextCssLoader.issuer.and.concat(matcher) : matcher;
            nextCssLoader.issuer.not = [unmatcher];
            delete nextCssLoader.issuer.and;
          } else {
            console.warn('next-transpile-modules: could not find default CSS rule, CSS imports may not work');
          }

          if (nextSassLoader) {
            nextSassLoader.issuer.or = nextSassLoader.issuer.and ? nextSassLoader.issuer.and.concat(matcher) : matcher;
            nextSassLoader.issuer.not = [unmatcher];
            delete nextSassLoader.issuer.and;
          } else {
            console.warn('next-transpile-modules: could not find default SASS rule, SASS imports may not work');
          }
        }

        // Overload the Webpack config if it was already overloaded
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },

      // webpackDevMiddleware needs to be told to watch the changes in the
      // transpiled modules directories
      webpackDevMiddleware(config) {
        // Replace /node_modules/ by the new exclude RegExp (including the modules
        // that are going to be transpiled)
        // https://github.com/zeit/next.js/blob/815f2e91386a0cd046c63cbec06e4666cff85971/packages/next/server/hot-reloader.js#L335

        const ignored = isWebpack5
          ? config.watchOptions.ignored.concat(modules)
          : config.watchOptions.ignored
              .filter((pattern) => !regexEqual(pattern, /[\\/]node_modules[\\/]/) && pattern !== '**/node_modules/**')
              .concat(unmatcher);

        config.watchOptions.ignored = ignored;

        if (typeof nextConfig.webpackDevMiddleware === 'function') {
          return nextConfig.webpackDevMiddleware(config);
        }

        return config;
      },
    });
  };

  return withTM;
};

module.exports = withTmInitializer;
