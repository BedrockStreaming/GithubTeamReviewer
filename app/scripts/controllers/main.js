/* global _ */

'use strict';

angular.module('gtrApp')
  .controller('MainCtrl', function ($scope, $location, $interval, PullFetcher, authManager, config, team) {
    var oauthEnabled    = !angular.isUndefined(config.githubOAuth);
    $scope.oauthEnabled = oauthEnabled;
    if (oauthEnabled) {
      authManager.authenticateTeams();
      $scope.loginUrls       = authManager.getLoginUrls();
      $scope.logoutClientIds = authManager.getLogoutClientIds();
    }

    $scope.pulls = PullFetcher.pulls;
    $scope.teams = config.teams;
    $scope.team  = team;

    if (typeof(config.teams[team].descendingOrder) !== 'undefined') {
      $scope.descendingOrder = config.teams[team].descendingOrder;
    } else {
      $scope.descendingOrder = true;
    }

    if (typeof(config.teams[team].labels) !== 'undefined') {
      $scope.labels = config.teams[team].labels;
    } else {
      $scope.labels = false;
    }

    if (typeof(config.teams[team].milestones) !== 'undefined') {
      $scope.milestones = config.teams[team].milestones;
    } else {
      $scope.milestones = false;
    }

    if (typeof(config.teams[team].reviews) !== 'undefined') {
      $scope.reviews = config.teams[team].reviews;
    } else {
      $scope.reviews = false;
    }

    var statePriorities = {
      'error':   4,
      'failure': 3,
      'pending': 2,
      'success': 1
    };

    /**
     * Sort statuses by priority
     *
     * @param array statuses
     */
    var sortStatuses = function (statuses) {

      // Group statuses by their context
      var statusesGrouped = _.groupBy(statuses, function (status) {
        return status.context;
      });

      // Get first status of each context
      statuses = _.toArray(statusesGrouped).map(function (statuses) {
        return statuses[0];
      });

      // Sort statuses by state priority
      statuses.sort(function (a, b) {
        var aPriority = statePriorities[a.state];
        var bPriority = statePriorities[b.state];

        if (aPriority === bPriority) {
          return 0;
        }

        return (aPriority > bPriority ? -1 : 1);
      });

      return statuses;
    };

    $scope.toArray = function (items) {
      var array = [];
      angular.forEach(items, function(item) {

        item.statuses = sortStatuses(item.statuses);

        array.push(item);
      });

      return array;
    };

    $scope.countReviews = function(reviews, state) {
      reviews = reviews || [];
      return reviews.filter(function(review) {
        return review.state === state;
      }).length;
    };

    $scope.logout = function(clientId) {
      authManager.logout(clientId);
      $scope.loginUrls       = authManager.getLoginUrls();
      $scope.logoutClientIds = authManager.getLogoutClientIds();
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
