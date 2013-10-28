angular.module('accretive', ['BlockUI'])
  .run(function($rootScope) {

    $rootScope.deployed = false;

    $rootScope.server = $rootScope.deployed ? "122.166.233.110:8080" : "localhost:3030";

  })

  .controller('MainCtrl', function($rootScope, $scope, $http, $blockUI, $location) {

    $scope.username = "arijit";
    $scope.password = "welcome";

  	$scope.go = function() {
  		console.log($scope.username);
  		console.log($scope.password);

  		console.log("inside");

  	  if (_.isUndefined($scope.username)) {
          return; 
      }

      if (_.isUndefined($scope.password)) {
        return; 
      }

      var params = $rootScope.deployed ? "/zcore/login/user/getapikey?" : "/login?";

      $scope.blockUI = $blockUI.createBlockUI({innerHTML: '<p> Verifying... </p> <img src="images/spinner.gif"> </img>'});
      $scope.blockUI.blockUI();

      var url = "http://" + $rootScope.server + params + "username=" + $scope.username + "&password=" + $scope.password + 
                "&domainname=" + "Default%20Domain";

      // http://122.166.233.110:8080/zcore/login/user/getapikey?username=arijit&password=welcome&domainname=Default%20Domain

      $http({method: 'GET', url : url}) 
      	.success(
      		function(response, code) {
      			console.log("success");
      			
      			$scope.blockUI.unblockUI();

            $rootScope.apikey = response.APIKey;

      			$location.path('/home'); 

      		}
      	)
      	.error(
      		function(response, code) {
      			console.log("error");
      			
      			$scope.blockUI.unblockUI();

      		}
      	);

  	}

  })

  .controller('HomeCtrl', function($rootScope, $scope, $http, $blockUI) {

  	$scope.seekResult = function(query) {

      if (_.isUndefined(query)) {
          return; 
      }

      $scope.queries = [];


      var params = $rootScope.deployed ? "/zcore/api/customer/accretive/ontology/search?" : "/search?";
      
      var url = "http://" + $rootScope.server + params + "query=" + query + 
                "&api_id=" + $rootScope.apikey.apiId + "&api_key=" + $rootScope.apikey.apiKey;

      // http://122.166.233.110:8080/zcore/api/customer/accretive/ontology/search?query=what%20is%20coporate%20tax&api_id=ce6dbcba8c293ae506ae00799d557d38&api_key=6ea207b8cb061b4a2ce2a94ab804b442

      $scope.blockUI = $blockUI.createBlockUI({innerHTML: '<p> Verifying... </p> <img src="images/spinner.gif"> </img>'});
      $scope.blockUI.blockUI();

      $http({method: 'GET', url : url}) 
        .success(
          function(response, code) {
            console.log("success");
            
            $scope.blockUI.unblockUI();

            $scope.queries = response.ontologySearchResult.faqs;

            $scope.getAnswer($scope.queries[0]);
          }
        )
        .error(
          function(response, code) {
            console.log("error");
            
            $scope.blockUI.unblockUI();

          }
        );
    };


    $scope.getAnswer = function(query) {

      $scope.question = query.title;

      var qna = query.content.split("Answer 1");

      $scope.extquestion = qna[0];

      if ($scope.question === $scope.extquestion) { 
        $scope.extquestion = "";
      }

      $scope.answers = qna.slice(1);      
    };

  })


  .config(function($routeProvider) {
    $routeProvider.when('/', {
      controller : 'MainCtrl',
      templateUrl : './templates/_t_index.html'
    }).when('/home', {
      controller : 'HomeCtrl',
      templateUrl : './templates/_t_search.html'
    }).otherwise({
      redirectTo: '/'
    });
  })