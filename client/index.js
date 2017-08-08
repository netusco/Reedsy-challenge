angular.module('conversion', [ 'conversionCtrl', 'conversionDirective' ])

.factory('socket', socket);

socket.$inject = ['$rootScope'];

function socket($rootScope) {
  let socket = io.connect();

  return {
      on: on,
      emit: emit
  };

  function on(eventName, callback) {
    socket.on(eventName, function() {
      let args = arguments;
      $rootScope.$apply(function() {
        callback.apply(socket, args);
      });
    });
  }

  function emit(eventName, data, callback) {
    socket.emit(eventName, data, function() {
      let args = arguments;
      $rootScope.$apply(function() {
        if (callback) {
          callback.apply(socket, args);
        }
      });
    });
  }
}
