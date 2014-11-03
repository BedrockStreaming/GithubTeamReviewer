'use strict';

angular
  .module('gtrApp', [
    'ngRoute',
    'gtrApp.config'
  ]).config(function ($routeProvider, config) {
    $routeProvider
      .when('/:team', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {team: function($q, $route, config) {
          var defer = $q.defer();
          if (config.teams[$route.current.params.team]) {
            defer.resolve($route.current.params.team);
          } else {
            defer.reject('Team does not exist');
          }

          return defer.promise;
        }}
      })
      .otherwise({
        redirectTo: '/' + Object.keys(config.teams)[0]
      });
  });
