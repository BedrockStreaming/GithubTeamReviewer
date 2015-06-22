'use strict';

angular.module('gtrApp')
  .controller('AuthCtrl', function ($window, URI, authManager) {
    var authFailed = function(err) {
      $window.alert('Authentication failed' + err.error ? ' : ' + err.error : '');
      $window.location.href = '/';
    };
    var searchArr = URI($window.location.href).search(true);
    if (searchArr.code && searchArr.state) {
      authManager.getAccessToken(searchArr.code, searchArr.state)
        .then(function() {
          $window.location.href = '/';
        }, authFailed);
    } else {
      authFailed();
    }
  });
