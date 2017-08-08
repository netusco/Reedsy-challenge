angular.module('conversionCtrl', [])

.controller('mainController', ($scope, $http, socket) => {

  $scope.value = 'Conversions';
  $scope.timeout = 5;
  $scope.updateMsgs = [];
  $scope.html = 0;
  $scope.pdf = 0;

  // update message  to notify changes on conversion states
  socket.on('updateMsg', (conversion) => {
    $scope.updateMsgs.push(conversion);
  });

  // remove msg method
  $scope.removeMsg = (id) => {
    $scope.updateMsgs = $scope.updateMsgs.filter((item) => {
      return item._id !== id;
    });
  }

  // find a list of conversions
  $scope.find = () => {

    $http.get('/api/conversions')
    .then((result) => {
      $scope.conversions = result.data;
    })
    .catch((err) => console.error('Error getting conversions data: %s', err));
  };

  // update conversion list on changes from the back
  socket.on('updateConversionList', () => {
    // find a list of conversions
    $scope.find();
  });

  // send a signal to node api to start send a file conversion job to the queue
  $scope.createConversion = (type) => {
    $scope[type] += 1;
    let name = type.toUpperCase() + ' # ' + $scope[type];

    $http.post('/api/conversion/', { type: type, name: name })
      .then((result) => {
        $scope.conversions = result.data;
      })
      .catch((err) => console.error('Error on %s conversion: \n' + err.data, type));
  };

  // get icon class for each state
  $scope.getStateIcon = (conversion) => {
    
    let icon;

    switch(conversion.state) {
      case 'In Queue':
        icon = 'glyphicon-time'
        break;
      case 'Processing':
        icon = 'glyphicon-repeat'
        break;
      case 'Processed':
        icon = 'glyphicon-ok'
        break;
    }
    return icon;
  }
});
