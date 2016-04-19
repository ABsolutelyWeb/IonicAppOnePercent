(function () {


var app = angular.module('onepercent', 
  [
  'ionic', 
  'angularMoment'
  ]);


app.controller("OnePercentCtrl", function($scope, $http) {
  $scope.posts = [];


  function showPosts (params, callback) {
    $http.get("https://www.reddit.com/r/lifehacks/new/.json", {params: params}).success(function(response) {
      var posts = [];
      angular.forEach(response.data.children, function (child){
        posts.push(child.data);
      });
      callback(posts);
    });    
  };


  $scope.showOldPosts = function () {
      var params={};
      if ($scope.posts.length > 0) {
        params['after'] = $scope.posts[$scope.posts.length - 1].name;
      }
      showPosts(params, function (pastPosts) {
        $scope.posts = $scope.posts.concat(pastPosts);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });

      $scope.newTab = function (url) {
        window.open(url, '_blank');
      };
  };


  $scope.showNewPosts = function () {
    var params={'before': $scope.posts[0].name};
      showPosts(params, function(newPosts) {
        $scope.posts = newPosts.concat($scope.posts);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };
});


app.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());