angular.module('conversionCtrl', [])

.controller('mainController', function($scope, $http, socket) {

  $scope.value = 'Conversions';
  $scope.pdf = undefined;
  $scope.html = undefined;

  socket.on('updateConversionList', function (ev, data) {

    console.log('[Websocket] updating conversion list');

    // find a list of conversions
    $scope.find();
  });

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

  // send a signal to node api to start send a file conversion job to the queue
  $scope.createConversion = function(type) {
    $http.post('/api/conversion/', { type: type })
      .then(function(result) {
        console.log('%s conversion queued', type);
        console.log('list of conversions updated');
        $scope.conversions = result.data;
      })
      .catch(function(err) {
        console.error('Error on %s conversion: \n' + err.data, type);
      });
  };

  // get icon class for each state
  $scope.getStateIcon = function(conversion) {
    
    let icon;

    switch(conversion.state) {
      case 'In Queue':
        icon = 'glyphicon-time'
        break;
      case 'Processing':
        icon = 'glyphicon-repeat'
        break;
      case 'Processed':
        icon = 'glyphicon-time'
        break;
    }
    return icon;
  }
});
