'use strict';

angular.module('gtrApp')
  .provider('PullFetcher', function () {
    var baseUrl = 'https://api.github.com';

    this.$get = ['$http', function ($http) {

      var currentTeam,
        currentApiUrl,
        authHeader;

      var pullFetcher = {
        pulls: {},
        setTeam: function (team) {
          currentTeam   = team;
          currentApiUrl = team.apiUrl || baseUrl;
          authHeader    = {};

          if (team.token) {
            authHeader = {'Authorization': 'token ' + team.token};
          }

          // Empty pulls object
          for (var id in this.pulls) {
            delete this.pulls[id];
          }
        },
        refreshPulls: function () {
          var self = this;

          // Remove closed PR
          angular.forEach(self.pulls, function (pull, id) {
            request(pull.url).then(function (response) {
              if (response.data.state === 'closed') {
                delete self.pulls[id];
              }
            });
          });

          // Update PR lists and status
          currentTeam.orgs.forEach(function (org) {
            getRepos(currentApiUrl + '/orgs/' + org);
          });
          if (typeof(currentTeam.members) !== 'undefined') {
            currentTeam.members.forEach(function (user) {
              getRepos(currentApiUrl + '/users/' + user);
            });
          }
        }
      };

      var request = function (url) {
        return $http({
          url: url,
          headers: authHeader
        });
      };

      var filterPulls = function (pull) {
        return (currentTeam.members || [pull.user.login]).indexOf(pull.user.login) !== -1;
      };

      var addStatusToPull = function (pull) {
        request(pull.statuses_url).then(function (response) {
          pull.statuses = response.data;
        });
      };

      var getRepoPulls = function (repo) {
        return request(repo.pulls_url.replace('{/number}', ''))
          .then(function (response) {
            var filtered = response.data.filter(filterPulls);
            filtered.forEach(addStatusToPull);

            return filtered;
          });
      };

      var getRepos = function (url, page) {
        if (page === undefined) {
          page = 1;
        }
        request(url + '/repos?per_page=100&page=' + page)
          .then(function (response) {
            response.data.forEach(function (repo) {
              getRepoPulls(repo).then(function (pulls) {
                pulls.forEach(function (pull) {
                  pullFetcher.pulls[pull.id] = pull;
                });
              });
            });
            if (response.data.length) {
              getRepos(url, page + 1);
            }
          });
      };

      return pullFetcher;
    }];
  });
