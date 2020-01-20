const rewire = require('rewire');
const anymatch = require('anymatch');

const withTmRewire = rewire('../next-transpile-modules');

const generateIncludes = withTmRewire.__get__('generateIncludes');
const generateExcludes = withTmRewire.__get__('generateExcludes');
const regexEqual = withTmRewire.__get__('regexEqual');

const modules = ['shared', 'and-another', '@scoped/something', 'core'];

describe('generateIncludes', () => {
  const includes = generateIncludes(modules);

  test('SHOULD match transpiledModules direct paths', () => {
    expect(anymatch(includes, '/users/pierre/project/node_modules/shared/test.js')).toBe(true);
    expect(anymatch(includes, '/users/pierre/project/node_modules/and-another/test.js')).toBe(true);
    expect(anymatch(includes, '/users/pierre/project/node_modules/@scoped/something/test.js')).toBe(true);

    expect(anymatch(includes, '/users/pierre/project/node_modules/shared/sub/test.js')).toBe(true);
    expect(anymatch(includes, '/users/pierre/project/node_modules/and-another/sub/test.js')).toBe(true);
    expect(anymatch(includes, '/users/pierre/project/node_modules/@scoped/something/sub/test.js')).toBe(true);
  });

  test('should match module paths', () => {
    expect(anymatch(includes, '/users/pierre/project/node_modules/shared')).toBe(true);
    expect(anymatch(includes, '/users/pierre/project/node_modules/and-another')).toBe(true);
    expect(anymatch(includes, '/users/pierre/project/node_modules/@scoped/something')).toBe(true);
  })

  test('should NOT match unreferenced modules', () => {
    expect(anymatch(includes, '/users/pierre/project/node_modules/and-yet-another/test.js')).toBe(false);
  });

  test('should NOT match node_modules packages inside a transpiled module', () => {
    expect(anymatch(includes, '/users/pierre/project/node_modules/shared/node_modules/other/test.js')).toBe(false);
    expect(anymatch(includes, '/users/pierre/project/node_modules/and-another/node_modules/other/test.js')).toBe(false);
    expect(anymatch(includes, '/users/pierre/project/node_modules/@scoped/node_modules/other/something/test.js')).toBe(
      false
    );
  });

  test('should handle win32 path delimiters well', () => {
    const module = '@scoped/something';
    const anotherModule = '@scoped\\something';

    expect(anymatch(includes, `C:\\test\\node_modules\\${module}\\sub\\test.js`)).toBe(true);
    expect(anymatch(includes, `C:\\test\\node_modules\\${anotherModule}\\sub\\test.js`)).toBe(true);
    expect(anymatch(includes, `C:\\test\\node_modules\\unused\\sub\\test.js`)).toBe(false);
  });

  test('should NOT conflict with similar package names', () => {
    expect(anymatch(includes, 'node_modules/core-js/test.js')).toBe(false);
  });
});

describe('generateExcludes', () => {
  const excludes = generateExcludes(modules);

  test('should NOT match transpiledModules direct paths', () => {
    expect(anymatch(excludes, '/users/pierre/project/node_modules/shared/test.js')).toBe(false);
    expect(anymatch(excludes, '/users/pierre/project/node_modules/and-another/test.js')).toBe(false);
    expect(anymatch(excludes, '/users/pierre/project/node_modules/@scoped/something/test.js')).toBe(false);

    expect(anymatch(excludes, '/users/pierre/project/node_modules/shared/sub/test.js')).toBe(false);
    expect(anymatch(excludes, '/users/pierre/project/node_modules/and-another/sub/test.js')).toBe(false);
    expect(anymatch(excludes, '/users/pierre/project/node_modules/@scoped/something/sub/test.js')).toBe(false);
  });

  test('SHOULD match unreferenced modules', () => {
    expect(anymatch(excludes, '/users/pierre/project/node_modules/and-yet-another')).toBe(true);
  });

  test('SHOULD match node_modules packages inside a transpiled module', () => {
    expect(anymatch(excludes, '/users/pierre/project/node_modules/shared/node_modules/other/test.js')).toBe(true);
    expect(anymatch(excludes, '/users/pierre/project/node_modules/and-another/node_modules/other/test.js')).toBe(true);
    expect(anymatch(excludes, '/users/pierre/project/node_modules/@scoped/node_modules/other/something/test.js')).toBe(
      true
    );
  });

  test('should handle win32 path delimiters well', () => {
    const module = '@scoped/something';
    const anotherModule = '@scoped\\something';

    expect(anymatch(excludes, `C:\\test\\node_modules\\${module}\\sub\\test.js`)).toBe(false);
    expect(anymatch(excludes, `C:\\test\\node_modules\\${anotherModule}\\sub\\test.js`)).toBe(false);
    expect(anymatch(excludes, `C:\\test\\node_modules\\unused\\sub\\test.js`)).toBe(true);
  });

  test('should match with package with similar name', () => {
    expect(anymatch(excludes, 'node_modules/core-js/test.js')).toBe(true);
  });
});

describe('regexEqual', () => {
  // Cannot test because of Jest https://github.com/facebook/jest/issues/2549
  // test('should return true if two regexps are similar', () => {
  //   expect(regexEqual(/a/, /a/)).toBe(true);
  //   expect(regexEqual(/a/gi, /a/ig)).toBe(true);
  // });

  test('should return false if two regexps are different', () => {
    expect(regexEqual(/a/, /[\\/]a[\\/]/)).toBe(false);
  });
});
