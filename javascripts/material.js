angular.module('testMod', ['ngMaterial','scDateTime']).controller('testCtrl', function($scope) {
	return $scope.date = new Date();
	// force update
}).run(['$templateCache', function($templateCache) {
  $templateCache.put('dateTimeDialog.tpl.html', '<md-dialog><time-date-picker display-mode="{{displayMode}}" default-mode="{{defaultMode}}" default-date="{{defaultDate}}" mindate="{{mindate}}" maxdate="{{maxdate}}" ng-model="model" on-cancel="onCancel()" on-save="onSave()"></time-date-picker></md-dialog>');
}])
.directive('dateTimePickerInput', [ '$mdDialog', '$filter', function($mdDialog, $filter) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope,
			 element,
			 attrs,
			 ngModelCtrl) {
			if(element[0].tagName.toLowerCase() !== 'input' || attrs['type'].toLowerCase() !== 'text') {
				throw new Error('date-time-picker-input directive must be instantiated as an attribute of a input with type="text"');
			}
			var _openModal;
			element.on('focus', function(){
				if(_openModal) return;
				ngModelCtrl.$setTouched();
				_openModal = $mdDialog.show({
					parent: angular.element(document.querySelector('body')),
					templateUrl: 'dateTimeDialog.tpl.html',
					controller: function ($scope, $mdDialog) {
						// See https://github.com/SimeonC/sc-date-time#options for details
						var passthroughAttrs = ['displayMode', 'defaultDate', 'defaultMode', 'mindate', 'maxdate']
						angular.forEach(passthroughAttrs, function (key) {
							$scope[key] = attrs[key];
						});
						if(angular.isDate(ngModelCtrl.$modelValue)) $scope.model = ngModelCtrl.$modelValue;
						$scope.onCancel = function () {
							$mdDialog.cancel();
							element[0].focus();
							element[0].blur();
						};
						$scope.onSave = function () {
							$mdDialog.hide($scope.model);
						};
					},
					show: true
				}).then(function(newDate) {
					ngModelCtrl.$modelValue.setTime(newDate.getTime());
					ngModelCtrl.$setDirty();
					element.val(formatDate(newDate));
					_openModal = null;
				});
			});
	
			if(attrs['ngMin']) {
				ngModelCtrl.$validators['min'] = function (dateValue) {
					return new Date(dateValue) >= new Date(attrs['ngMin']);
				};
			}
	
			if(attrs['ngMax']) {
				ngModelCtrl.$validators['max'] = function (dateValue) {
					return new Date(dateValue) <= new Date(attrs['ngMax']);
				};
			}
			
			ngModelCtrl.$formatters.push(formatDate);
			function formatDate(value){
				return $filter('date')(value, attrs['displayFormat'] || 'EEEE d MMMM yyyy, h:mm a');
			};
		}
	};
}]);