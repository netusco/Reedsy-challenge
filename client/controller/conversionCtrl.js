angular.module('conversionCtrl', [])

.controller('mainController', function($scope, $http) {

  // find a list of conversions
  $scope.find = function() {

    $http.get('/api/conversions')
    .then(function(result) {
      $scope.conversions = result.data;
    })
    .catch(function(err) {
      console.error('Error getting conversions data: %s', err);
    });
  };
});
