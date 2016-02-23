'use strict';

angular.module('auctionApp')
  .directive('inventory', function ($http, $modal, $rootScope, Auth) {
    return {
      templateUrl: 'app/directives/inventory/inventory.html',
      restrict: 'EA',
      link: function ($scope, element, attrs) {
         Auth.getCurrentUser().$promise.then(function(user){
           $scope.user =user;
           $http.get('/api/inventories/'+$scope.user.id).success(function(response) {
             $scope.inventory = response;
           });
        });

        $rootScope.$on('refresh', function(){
          $http.get('/api/inventories/'+$scope.user.id).success(function(response) {
            $scope.inventory = response;
          });
        });


        $scope.open = function (size,item) {

          var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
              user: function () {
                return $scope.user;
              },
              item: function () {
                return item;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
          });
        };
      }
    };
  }).controller('ModalInstanceCtrl', function ($scope, $modalInstance ,$rootScope ,mySocket, user, item) {

    $scope.user = user;
    $scope.$watch('cant',function(value){
      if(value>item.cant)
        $scope.cant=item.cant;
    })
    $scope.maxQuantity = item.cant;
    $scope.minBid = 0;
    $scope.cant = 1;

    $scope.ok = function () {
      if(!$rootScope.activeAuction && $scope.cant>0 && $scope.minBid>=0){
        mySocket.emit('start auction',{
          idSeller:user.id,
          seller:user.username,
          idItem:item.id,
          itemName:item.name,
          image:item.image,
          cant:$scope.cant,
          minBid:$scope.minBid});
        $modalInstance.close('');
      };
    }


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
