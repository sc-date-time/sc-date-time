angular.module('testMod', ['scDateTime', 'mgcrea.ngStrap']).controller('testCtrl', function($scope) {
	return $scope.data = {date: new Date()};
	// force update
})
.config(['$provide', function($provide){
	$provide.decorator('scDateTimeConfig', ['$delegate', function(scDateTimeConfig) {
		scDateTimeConfig.defaultTheme = 'bootstrap';
		return scDateTimeConfig;
	}]);
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('dateTimeDialog.tpl.html', '<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog time-date"><div class="modal-content"><time-date-picker display-mode="{{displayMode}}" default-mode="{{defaultMode}}" default-date="{{defaultDate}}" mindate="{{mindate}}" maxdate="{{maxdate}}" ng-model="model" on-cancel="onCancel()" on-save="onSave()"></time-date-picker></div></div></div>');
  $templateCache.put('dateTimePopover.tpl.html', '<div class="popover date-time"><div class="arrow"></div><time-date-picker class="popover-content" display-mode="{{displayMode}}" default-mode="{{defaultMode}}" default-date="{{defaultDate}}" mindate="{{mindate}}" maxdate="{{maxdate}}" ng-model="model" autosave="true"></time-date-picker></div>');
}])
.directive('dateTimePickerInput', [ '$modal', '$filter', function($modal, $filter) {
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
				_openModal = $modal({
					templateUrl: 'dateTimeDialog.tpl.html',
					scope: scope.$new(),
					controller: [
						'$scope', function ($scope) {
							// See https://github.com/SimeonC/sc-date-time#options for details
							var passthroughAttrs = ['displayMode', 'defaultDate', 'defaultMode', 'mindate', 'maxdate']
							angular.forEach(passthroughAttrs, function (key) {
								$scope[key] = attrs[key];
							});
							if(angular.isDate(ngModelCtrl.$modelValue)) $scope.model = ngModelCtrl.$modelValue;
							$scope.onCancel = function () {
								_openModal.hide();
								element[0].focus();
								element[0].blur();
								_openModal = null;
							};
							$scope.onSave = function () {
								ngModelCtrl.$modelValue.setTime($scope.model.getTime());
								ngModelCtrl.$setDirty();
								element.val(formatDate($scope.model));
								_openModal.hide();
								_openModal = null;
							};
						}
					],
					show: true
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
}]).directive('dateTimePickerDropdown', [ '$popover', '$filter', function($popover, $filter) {
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
			$popover(element, {
				templateUrl: 'dateTimePopover.tpl.html',
				scope: scope.$new(),
				trigger: 'click',
				placement: 'bottom',
				controller: [
					'$scope', function ($scope) {
						// See https://github.com/SimeonC/sc-date-time#options for details
						var passthroughAttrs = ['displayMode', 'defaultDate', 'defaultMode', 'mindate', 'maxdate']
						angular.forEach(passthroughAttrs, function (key) {
							$scope[key] = attrs[key];
						});
						if(angular.isDate(ngModelCtrl.$modelValue)) $scope.model = ngModelCtrl.$modelValue;
						else $scope.model = new Date();
						$scope.$watch('model', function(value){
							ngModelCtrl.$modelValue.setTime(value.getTime());
							ngModelCtrl.$setDirty();
							element.val(formatDate(value));
						}, true);
					}
				]
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