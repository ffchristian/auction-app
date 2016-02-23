'use strict';

angular.module('auctionApp')
  .directive('auction', function (mySocket,$timeout, $rootScope, Auth) {
    return {
      templateUrl: 'app/directives/auction/auction.html',
      restrict: 'EA',
      link: function ($scope, element, attrs) {

        var stopped;
        $scope.counter = 90;
        Auth.getCurrentUser().$promise.then(function(user){
          $scope.user =user;
        });

        var flag= true;
        $scope.bet = function () {
          mySocket.emit('bet auction',{
            idBettor:$scope.user.id,
            usernameBettor:$scope.user.username,
            bid: $scope.bid
          });
        };

        $scope.auction = null;
        mySocket.emit('force check auction active');

        mySocket.on('restore 10 seconds', function (data) {
          $scope.counter = 10;
          $timeout(function () {
            $scope.auction = data.payload;
          },200);
        });

        mySocket.on('check auction active', function (data) {


          if(data.payload){
            $scope.counter = 90-data.payload.left;
            if(flag){
              flag = false;
              $rootScope.activeAuction = true;

              $scope.counter = 90-data.payload.left;
              $scope.countdown();

            }
            $timeout(function () {
              $scope.auction = data.payload;
            },200);

          }else{
            flag = true;
            $scope.auction =null;
            $rootScope.activeAuction = false;
            $scope.flagFinished = false;

          }
          $timeout(function () {
            $rootScope.$broadcast('refresh');
          },200);

        })

        mySocket.on('finish auction', function (data) {
          $scope.counter = 10;
          $timeout(function () {
            $scope.auction = data.payload;
            $scope.flagFinished = true
          },200);
        });

        $scope.countdown = function() {

          stopped = $timeout(function() {
            $scope.counter--;
            if($scope.counter>0)
              $scope.countdown();
          }, 1000);
        };

        $scope.stop = function(){
          $timeout.cancel(stopped);

        }

      }
    };
  });
