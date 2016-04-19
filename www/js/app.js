(function() {

var app = angular.module('onepercent', ['ionic', 'angularMoment'])

app.controller("OnePercentCtrl", function($scope, $http) {
  $scope.stories = [];

  function loadStories (params, callback) {
      $http.get("https://www.reddit.com/r/lifehacks/new/.json", {params: params})
        .success(function(response) {
          var stories = [];
          angular.forEach(response.data.children, function(child){
            stories.push(child.data);
          });
          callback(stories);
      });    
  };

  $scope.loadOlderStories = function () {
      var params={};
      if ($scope.stories.length > 0) {
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }
      loadStories(params, function(olderStories){
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });

      $scope.openLink = function(url) {
        window.open(url, '_blank');
      };
  };
  $scope.loadNewerStories = function () {
    var params={'before': $scope.stories[0].name};
      loadStories(params, function(newerStories) {
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if(window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());