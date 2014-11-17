'use strict';

angular.module('gtrApp')
  .controller('MainCtrl', function ($scope, $location, $interval, PullFetcher, config, team) {
    $scope.pulls = PullFetcher.pulls;
    $scope.teams = config.teams;
    $scope.team  = team;

    if (typeof(config.teams[team].descendingOrder) !== 'undefined') {
      $scope.descendingOrder = config.teams[team].descendingOrder;
    } else {
      $scope.descendingOrder = true;
    }

    $scope.toArray = function (items) {
      var array = [];
      angular.forEach(items, function(item) {
        array.push(item);
      });

      return array;
    };

    $scope.$watch('team', function (team) {
      $location.path(team);
    });

    $scope.$on('$destroy', function () {
      $interval.cancel(polling);
    });

    var polling = $interval(function () {
      PullFetcher.refreshPulls();
    }, config.refreshInterval * 1000);

    PullFetcher.setTeam($scope.teams[team]);
    PullFetcher.refreshPulls();
  });
