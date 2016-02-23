'use strict';

angular.module('auctionApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'LocalStorageModule',
  'btford.socket-io',
  'timer',
  'uuid4'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('auctionApp');
  })
  .config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setStorageType('sessionStorage');
  }).
  factory('mySocket', function (socketFactory) {
    return socketFactory();
  })
  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location, localStorageService) {
    return {
      // Add authorization token to headers
      request: function (config) {
        var uuid = localStorageService.get('uuid')
        config.headers = config.headers || {};
        if ($cookieStore.get('token-'+uuid)) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token-'+uuid);
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          //$location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token-'+localStorageService.get('uuid'));
          $rootScope.isLoggedIn = false;
          localStorageService.remove('logged');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  });
