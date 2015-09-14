angular.module('testMod', ['ngMaterial','scDateTime']).controller('testCtrl', function($scope) {
	return $scope.date = new Date();
});