'use strict';

angular.module('auctionApp')
  .directive('userData', function (localStorageService, $http, $rootScope, Auth) {
    return {
      templateUrl: 'app/directives/user-data/user-data.html',
      restrict: 'EA',
      /*scope: {
        user:"="
      },*/
      link: function ($scope, element, attrs) {


        $scope.user = Auth.getCurrentUser();
        $rootScope.$on('refresh', function(){
          $http.get('/api/users/me').success(function(user) {
            $scope.user = user;
          });
        })


        $scope.logout = function () {
          Auth.logout();
          $rootScope.isLoggedIn = false;
          localStorageService.remove('logged');
         /* $http.post('/api/users/logout',{username:$scope.user.username}).success(function(response) {
            $rootScope.isLoggedIn = false;
            $scope.user = {};
            localStorageService.remove('logged');
          });*/
        }

      }
    };
  });
