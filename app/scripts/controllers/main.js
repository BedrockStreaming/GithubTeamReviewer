'use strict';

angular.module('gtrApp')
  .controller('MainCtrl', function ($scope, $location, $interval, PullFetcher, config, team) {
    $scope.pulls = PullFetcher.pulls;
    $scope.teams = config.teams;
    $scope.team  = team;
    $scope.wallDisplay = config.wallDisplay;

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

    /**
     * getVisibleTextColor gets black or white, visible with this background
     * @type {string} bgcolor hexademical color, 6 chars (ex: "ffffff")
     */
    $scope.getVisibleTextColor = function(bgcolor) {
      var r = parseInt(bgcolor.substr(0,2),16);
      var g = parseInt(bgcolor.substr(2,2),16);
      var b = parseInt(bgcolor.substr(4,2),16);
      var yiq = ((r*299)+(g*587)+(b*114))/1000;
      return yiq >= 128 ? '000' : 'fff';
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
