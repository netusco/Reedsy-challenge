angular.module('conversionDirective', [])

.directive('notification', ($timeout) => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      ngModel: '=',
      timeout: '=',
      close: '&onClose'
    },
    template: (() => {
      let ficon = '<span class="f-icon glyphicon" ng-class="ngModel.state == '+"'Processed'"+' ? '+"'glyphicon-ok'"+' : '+"'glyphicon-info-sign'"+'"></span>';
      let fmsg =  '<span class="f-msg">Request "{{ngModel.name | uppercase}}" {{ngModel.state == "Processing" ? "started processing" : "processed"}}</span>';
      let template = '<div>'+ficon+fmsg+'</div>';
      return template;
    })(),
    link: (scope, element, attrs) => {
      $timeout(() => {
        element.parent().remove();
        scope.close({id: scope.ngModel._id});
      }, Number(scope.timeout)*1000);
    }
  }
});
