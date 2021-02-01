const rewire = require('rewire');
const path = require('path');

const withTmRewire = rewire('../next-transpile-modules');

const regexEqual = withTmRewire.__get__('regexEqual');
const webpackMatcher = withTmRewire.__get__('webpackMatcher');

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

describe('webpackMatcher', () => {
  test('should return correct value on Unix systems', () => {
    const testStrings = ['test', '@mono/module', '@mono/sub/module', '@mono\\module', '@mono\\sub\\module'];
    const matcherInstance = webpackMatcher(testStrings);
    expect(matcherInstance(path.normalize('/Users/User1/module/node_modules/test/test.ext'))).toBe(true);
    expect(matcherInstance(path.normalize('/Users/User1/module/node_modules/@mono/module/foo'))).toBe(true);
    expect(matcherInstance(path.normalize('/Users/User1/module/node_modules/@mono/sub/module/foo'))).toBe(true);
    expect(matcherInstance(path.normalize('/Users/User1/module/node_modules/@mono/false/module'))).toBe(false);
    expect(matcherInstance(path.normalize('/Users/User1/module/node_modules/@mono/false'))).toBe(false);
  });

  test('should return correct value on Windows systems', () => {
    const testStrings = ['test', '@mono\\module', '@mono\\sub\\module'];
    const matcherInstance = webpackMatcher(testStrings);
    expect(matcherInstance('C:\\module\\node_modules\\test\\test.ext')).toBe(true);
    expect(matcherInstance('C:\\module\\node_modules\\@mono\\module\\foo')).toBe(true);
    expect(matcherInstance('C:\\module\\node_modules\\@mono\\sub\\module\\foo')).toBe(true);
    expect(matcherInstance('C:\\module\\node_modules\\@mono\\false\\module')).toBe(false);
    expect(matcherInstance('C:\\module\\node_modules\\@mono\\false')).toBe(false);
  });
});
