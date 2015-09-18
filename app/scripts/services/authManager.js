/* global _ */

'use strict';

angular.module('gtrApp')
  .factory('authManager', function ($http, $q, $state, URI, config) {
    return {

      getAccessTokens: function() {
        if (!localStorage.githubOAuthAccessTokens) {
          return {};
        }

        return JSON.parse(localStorage.githubOAuthAccessTokens);
      },

      setAccessTokens: function(accessTokens) {
        localStorage.githubOAuthAccessTokens = JSON.stringify(accessTokens);
      },

      getLoginUrls: function() {
        var accessTokens = this.getAccessTokens();
        var loginUrls = [];
        _.forEach(config.githubOAuth.apps, function(appConfig) {
          if (!accessTokens[appConfig.clientId]) {
            var loginUrl = appConfig.url + '/login/oauth/authorize';
            var loginParams = {
              client_id: appConfig.clientId,
              redirect_uri: $state.href('auth', null, {absolute: true}),
              scope: 'repo,read:org',
              state: appConfig.clientId,
            };

            loginUrls.push({
              githubHostname: URI(appConfig.url).hostname(),
              loginUrl: URI(loginUrl).addSearch(loginParams).toString(),
            });
          }
        });

        return loginUrls;
      },

      getLogoutClientIds: function() {
        var accessTokens = this.getAccessTokens();
        var logoutClientIds = [];

        _.forEach(accessTokens, function(accessToken, clientId) {
          var appUrl = _.findWhere(config.githubOAuth.apps, {clientId:clientId});
          logoutClientIds.push({
            clientId:clientId,
            githubHostname:URI(appUrl.url).hostname()
          });
        });

        return logoutClientIds;
      },

      getAccessToken: function(code, clientId) {
        if(angular.isUndefined(code) || angular.isUndefined(clientId)) {
          return false;
        }

        var authManager = this;
        var deferred = $q.defer();

        var gatekeeperUrl = config.githubOAuth.gatekeeperBaseUrl + '/authenticate/' + clientId + '/' + code;
        $http.get(gatekeeperUrl)
          .success(function(data) {
            if (data.token) {
              var accessTokens = authManager.getAccessTokens();
              if (!accessTokens) {
                accessTokens = {};
              }
              accessTokens[clientId] = data.token;
              authManager.setAccessTokens(accessTokens);

              deferred.resolve(data.token);
            } else {
              deferred.reject('No token found');
            }
          })
          .error(function(reason) {
            deferred.reject(reason);
          });

        return deferred.promise;
      },

      authenticateTeams: function() {
        var accessTokens = this.getAccessTokens();
        // Add OAuth token on each team if found
        _.forEach(config.teams, function(team) {
          if (!team.token && team.oauthAppClientId && accessTokens[team.oauthAppClientId]) {
            team.token = accessTokens[team.oauthAppClientId];
          }
        });
      },

      logout: function(clientId) {
        if(angular.isUndefined(clientId)) {
          return false;
        }

        var accessTokens = this.getAccessTokens();
        if (accessTokens) {
          delete accessTokens[clientId];
          this.setAccessTokens(accessTokens);
        }
      },

    };
  });
