'use strict';

var HttpBackend = require('httpbackend');
var backend;

describe('Test GTR screen', function () {

  describe('Basic tests', function () {
    it('should list teams', function () {
      browser.get('/');

      var teams = element.all(by.css('header select option')).map(function(element, index) {
        return {
          index: index,
          text: element.getText()
        };
      });

      expect(teams).toEqual([
        {index: 0, text: 'burton'},
        {index: 1, text: 'cytron'},
        {index: 2, text: 'service-polls'}
      ]);
    });

    it('should load first team by defaut', function () {
      browser.get('/');
      expect(browser.getLocationAbsUrl()).toBe('/cytron');

      expect(element(by.css('header select')).$('option:checked').getText()).toEqual('cytron');
    });

    it('should change team on route change', function () {
      browser.get('#/burton');

      expect(element(by.css('header select')).$('option:checked').getText()).toEqual('burton');

      browser.get('#/cytron');
      expect(element(by.css('header select')).$('option:checked').getText()).toEqual('cytron');

      // Nonexistent team
      browser.get('#/raoul');
      expect(element(by.css('header')).isPresent()).toBe(false);
    });

    it('should change route on team change', function () {
      browser.get('/');
      expect(browser.getLocationAbsUrl()).toBe('/cytron');

      element(by.cssContainingText('header select option', 'burton')).click();
      expect(browser.getLocationAbsUrl()).toBe('/burton');
    });
  });

  describe('Test with API calls', function () {

    beforeEach(function () {
      backend = new HttpBackend(browser);

      // Repos
      backend.whenGET('/api/v3/orgs/m6web/repos?per_page=100&page=1').respond([{
        'id': 3,
        'name': 'site-nopr',
        'pulls_url': '/api/v3/repos/m6web/service-nopr/pulls{/number}',
      }]);
      backend.whenGET('/api/v3/orgs/m6web/repos?per_page=100&page=2').respond([{
        'id': 1,
        'name': 'service-polls',
        'pulls_url': '/api/v3/repos/m6web/service-polls/pulls{/number}',
      }]);
      backend.whenGET('/api/v3/orgs/replay/repos?per_page=100&page=1').respond([{
        'id': 3,
        'name': 'bundle-polls-client',
        'pulls_url': '/api/v3/repos/replay/bundle-polls-client/pulls{/number}',
      }]);

      // Pulls
      backend.whenGET('/api/v3/repos/m6web/service-nopr/pulls').respond([]);
      backend.whenGET('/api/v3/repos/m6web/service-polls/pulls').respond([{
        'id': 6467,
        'html_url': 'http://example.com/m6web/service-polls/pull/54',
        'number': 54,
        'title': 'PR 54',
        'state': 'open',
        'user': {
          'login': 'karlouche',
          'avatar_url': 'http://example.com/karlouche.jpg'
        },
        'created_at': '2014-07-28T15:28:58Z',
        'updated_at': '2014-07-28T15:28:58Z',
        'closed_at': null,
        'merged_at': null,
        'statuses_url': '/api/v3/repos/m6web/service-polls/statuses/54',
        'head': {
          'repo': {
            'html_url': 'http://example.com/m6web/service-polls',
            'full_name': 'm6web/service-polls',
            'name': 'service-polls'
          }
        }
      },
      {
        'id': 6468,
        'html_url': 'http://example.com/m6web/service-polls/pull/55',
        'number': 55,
        'title': 'PR 55',
        'state': 'open',
        'user': {
          'login': 'papy',
          'avatar_url': 'http://example.com/papy.jpg'
        },
        'created_at': '2014-08-28T15:28:58Z',
        'updated_at': '2014-08-28T15:28:58Z',
        'closed_at': null,
        'merged_at': null,
        'statuses_url': '/api/v3/repos/m6web/service-polls/statuses/55',
        'head': {
          'repo': {
            'html_url': 'http://example.com/m6web/service-polls',
            'full_name': 'm6web/service-polls',
            'name': 'service-polls'
          }
        }
      },
      {
        'id': 6469,
        'html_url': 'http://example.com/m6web/service-polls/pull/56',
        'number': 56,
        'title': 'PR 56',
        'state': 'open',
        'user': {
          'login': 'bieber',
          'avatar_url': 'http://example.com/bieber.jpg'
        },
        'created_at': '2014-10-28T15:28:58Z',
        'updated_at': '2014-10-28T15:28:58Z',
        'closed_at': null,
        'merged_at': null,
        'statuses_url': '/api/v3/repos/m6web/service-polls/statuses/56',
        'head': {
          'repo': {
            'html_url': 'http://example.com/m6web/service-polls',
            'full_name': 'm6web/service-polls',
            'name': 'service-polls'
          }
        }
      }]);
      backend.whenGET('/api/v3/repos/replay/bundle-polls-client/pulls').respond([{
        'id': 5895,
        'html_url': 'http://example.com/replay/bundle-polls-client/pull/49',
        'number': 49,
        'title': 'PR 49',
        'state': 'open',
        'user': {
          'login': 'bieber',
          'avatar_url': 'http://example.com/bieber.jpg'
        },
        'created_at': '2014-07-09T16:27:45Z',
        'updated_at': '2014-07-28T11:54:03Z',
        'closed_at': null,
        'merged_at': null,
        'statuses_url': '/api/v3/repos/replay/bundle-polls-client/statuses/49',
        'head': {
          'repo': {
            'html_url': 'http://example.com/replay/bundle-polls-client',
            'full_name': 'replay/bundle-polls-client',
            'name': 'bundle-polls-client'
          }
        }
      },
      {
        'id': 5896,
        'html_url': 'http://example.com/replay/bundle-polls-client/pull/50',
        'number': 50,
        'title': 'PR 50',
        'state': 'open',
        'user': {
          'login': 'karlouche',
          'avatar_url': 'http://example.com/karlouche.jpg'
        },
        'created_at': '2014-08-09T16:27:45Z',
        'updated_at': '2014-08-10T11:54:03Z',
        'closed_at': null,
        'merged_at': null,
        'statuses_url': '/api/v3/repos/replay/bundle-polls-client/statuses/50',
        'head': {
          'repo': {
            'html_url': 'http://example.com/replay/bundle-polls-client',
            'full_name': 'replay/bundle-polls-client',
            'name': 'bundle-polls-client'
          }
        }
      }]);

      //Statuses
      backend.whenGET('/api/v3/repos/m6web/service-polls/statuses/54').respond([]);
      backend.whenGET('/api/v3/repos/m6web/service-polls/statuses/55').respond([]);
      backend.whenGET('/api/v3/repos/m6web/service-polls/statuses/56').respond([{
        'context': 'default',
        'state': 'success'
      }]);
      backend.whenGET('/api/v3/repos/replay/bundle-polls-client/statuses/49').respond([{
        'context': 'default',
        'state': 'success'
      }, {
        'context': 'foobar',
        'state': 'pending'
      }, {
        'context': 'foobar',
        'state': 'success'
      }]);
      backend.whenGET('/api/v3/repos/replay/bundle-polls-client/statuses/50').respond([{
        'context': 'default',
        'state': 'failure'
      }, {
        'context': 'default',
        'state': 'success'
      }, {
        'context': 'foobar',
        'state': 'success'
      }]);

      // Others
      backend.whenGET(/.*/).passThrough();
    });

    afterEach(function() {
        backend.clear();
    });

    var getPulls = function(element, index) {
      return {
        index: index,
        text: element.getText(),
        class: element.getAttribute('class').then(function (classes) {
          if (classes.match(/(success|failure|pending)/)) {
            return classes.replace(/^.*(success|failure|pending).*$/, '$1');
          }

          return '';
        }),
        avatar: element.$('img').getAttribute('src'),
        pullUrl: element.$('.link a').getAttribute('href'),
      };
    };

    it('should display cytron PR', function () {
      browser.get('#/cytron');

      var pulls = element.all(by.css('.pulls li')).map(getPulls);

      expect(pulls).toEqual([
        {
          index: 0,
          text: '#56 PR 56\nm6web/service-polls 28/10/2014',
          class: 'success',
          avatar: 'http://example.com/bieber.jpg',
          pullUrl: 'http://example.com/m6web/service-polls/pull/56'
        },
        {
          index: 1,
          text: '#50 PR 50\nreplay/bundle-polls-client 10/08/2014',
          class: 'failure',
          avatar: 'http://example.com/karlouche.jpg',
          pullUrl: 'http://example.com/replay/bundle-polls-client/pull/50'
        },
        {
          index: 2,
          text: '#54 PR 54\nm6web/service-polls 28/07/2014',
          class: '',
          avatar: 'http://example.com/karlouche.jpg',
          pullUrl: 'http://example.com/m6web/service-polls/pull/54'
        },
        {
          index: 3,
          text: '#49 PR 49\nreplay/bundle-polls-client 28/07/2014',
          class: 'pending',
          avatar: 'http://example.com/bieber.jpg',
          pullUrl: 'http://example.com/replay/bundle-polls-client/pull/49'
        }
      ]);
    });

    it('should display burton PR', function () {
      browser.get('#/burton');

      var pulls = element.all(by.css('.pulls li')).map(getPulls);

      expect(pulls).toEqual([{
          index: 0,
          text: '#55 PR 55\nm6web/service-polls 28/08/2014',
          class: '',
          avatar: 'http://example.com/papy.jpg',
          pullUrl: 'http://example.com/m6web/service-polls/pull/55'
      }]);
    });

    it('should display service-polls PR', function () {
      browser.get('#/service-polls');

      var pulls = element.all(by.css('.pulls li')).map(getPulls);

      expect(pulls).toEqual([
        {
          index: 0,
          text: '#54 PR 54\nm6web/service-polls 28/07/2014',
          class: '',
          avatar: 'http://example.com/karlouche.jpg',
          pullUrl: 'http://example.com/m6web/service-polls/pull/54'
        },
        {
          index: 1,
          text: '#55 PR 55\nm6web/service-polls 28/08/2014',
          class: '',
          avatar: 'http://example.com/papy.jpg',
          pullUrl: 'http://example.com/m6web/service-polls/pull/55'
        },
        {
          index: 2,
          text: '#56 PR 56\nm6web/service-polls 28/10/2014',
          class: 'success',
          avatar: 'http://example.com/bieber.jpg',
          pullUrl: 'http://example.com/m6web/service-polls/pull/56'
        }
      ]);
    });

  });

  describe('Test OAuth', function () {

    beforeEach(function () {
      backend = new HttpBackend(browser);

      // Gatekeeper
      backend.whenGET('http://gatekeeper:9999/authenticate/c13nt1D/t3mpC0d3')
        .respond({token:'d4t0k3n'});
      // Others
      backend.whenGET(/.*/).passThrough();
    });

    afterEach(function() {
        backend.clear();
    });

    it('should display Auth links', function () {
      browser.get('/');

      var authBtn = element(by.css('div[ng-show="oauthEnabled"]>a'));
      expect(authBtn.isDisplayed()).toBeTruthy();

      authBtn.click();

      var firstLoginLink = element(by.css('div[ng-show="oauthEnabled"] li a[href="https://github.somewhere.fr/login/oauth/authorize?client_id=c13nt1D&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2F%23%2Fauth&scope=repo%2Cread%3Aorg&state=c13nt1D"]'));
      expect(firstLoginLink.isDisplayed()).toBeTruthy();

      var secondLoginLink = element(by.css('div[ng-show="oauthEnabled"] li a[href="https://github.com/login/oauth/authorize?client_id=90n3y&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2F%23%2Fauth&scope=repo%2Cread%3Aorg&state=90n3y"]'));
      expect(secondLoginLink.isDisplayed()).toBeTruthy();

    });

    it('should authenticate when github code is passed in url', function () {
      browser.get('/?code=t3mpC0d3&state=c13nt1D#/auth');
      browser.driver.sleep(1000);
      expect(browser.getLocationAbsUrl()).toEqual('/cytron');

      element(by.css('div[ng-show="oauthEnabled"]>a')).click();
      var logoutBtn = element(by.css('div[ng-show="oauthEnabled"] li:last-child a'));
      expect(logoutBtn.getText()).toEqual('Logout from github.somewhere.fr');

      logoutBtn.click();

      var firstLoginLink = element(by.css('div[ng-show="oauthEnabled"] li a[href="https://github.somewhere.fr/login/oauth/authorize?client_id=c13nt1D&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2F%23%2Fauth&scope=repo%2Cread%3Aorg&state=c13nt1D"]'));
      expect(firstLoginLink.isDisplayed()).toBeTruthy();

    });

  });

});
