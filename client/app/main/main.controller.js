'use strict';

angular.module('auctionApp')
  .controller('MainCtrl', function ($scope, $rootScope, $http, localStorageService, Auth) {
    $scope.data={};
    $scope.awesomeThings = [];

    if(localStorageService.get('logged') && localStorageService.get('logged')==true){
      $rootScope.isLoggedIn = localStorageService.get('logged');
    }else{
      $rootScope.isLoggedIn = false;
    }




    $scope.sign = function () {

      Auth.login({
        username: $scope.data.userName
      })
        .then( function() {
          $rootScope.isLoggedIn = true;
          localStorageService.set('logged',true);

        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });

    }



  });
