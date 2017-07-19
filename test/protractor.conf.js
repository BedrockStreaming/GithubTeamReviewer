'use strict';

var path = require('path');
var SeleniumConfig = require('webdriver-manager/built/lib/config').Config;
var SeleniumChrome = require('webdriver-manager/built/lib/binaries/chrome_driver').ChromeDriver;
var seleniumChrome = new SeleniumChrome();
seleniumChrome.versionCustom = '2.30';

// An example configuration file.
exports.config = {
  baseUrl: 'http://localhost:9000/',
  chromeDriver: path.resolve(SeleniumConfig.getSeleniumDir(), seleniumChrome.executableFilename()),

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=1280,800']
    }
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/e2e/**/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
