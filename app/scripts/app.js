'use strict';

angular
  .module('gtrApp', [
    'ui.router',
    'angular-uri',
    'gtrApp.config'
  ]).config(function ($stateProvider, $urlRouterProvider, config) {
    $stateProvider

      .state('auth', {
        url: '/auth',
        controller: 'AuthCtrl',
        reloadOnSearch: false
      })

      .state('main', {
        url: '/:team',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {team: function($q, $stateParams, config) {
          var defer = $q.defer();
          if (config.teams[$stateParams.team]) {
            defer.resolve($stateParams.team);
          } else {
            defer.reject('Team does not exist');
          }

          return defer.promise;
        }}
      });

      $urlRouterProvider.otherwise('/' + Object.keys(config.teams)[0]);
  });
