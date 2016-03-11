(function(){
    angular.module('WebDev')
    .controller('MainController', ['$scope', '$http', '$interval', '$rootScope', 'Upload', 
        function($scope, $http, $interval, $rootScope, Upload){
            
        
          if(localStorage['User-Data']){
              $scope.user = JSON.parse(localStorage['User-Data']);
              console.log($scope.user.username);
              console.log($scope.user.email);
              $rootScope.loggedIn = true;
            }
 
              $scope.upload = function(file, errfiles){
                $scope.f = file;
                  if(file){
                      Upload.upload({
                          url: 'api/resource/post',
                          method:'POST',
                          data: {userId: $scope.user._id, file:file}
                      }).progress(function(evt){
                          console.log("firing");
                      }).success(function(data){
                          $scope.file = data;
                          console.log('Guardado');
                      }).error(function(error){
                          console.log(error);
                      })
                  }
              };

            $scope.sendWaste = function(event){
                if(event.which === 13){
                    var request = {
                        user: $scope.user.username || $scope.user.email,
                        userId: $scope.user._id,
                        userImage: $scope.user.image,
                        content: $scope.newWaste
                    }
                    
                    $http.post('api/waste/post', request).success(function(response){
                        console.log(response);
                        $scope.wastes = response;
                    }).error(function(error){
                            console.error(error);
                    })
                   window.location.reload(true);
                }
                
            };
            
            function getWastes (initial){
                $http.get('api/waste/get').success(function (response){
                    if(initial){
                        $scope.wastes = response;
                    }else{
                        if(response.lenght > $scope.wastes.length){
                        $scope.incomingWastes = response;
                        }
                    }
                })
            };
            
            $interval(function(){
                getWastes(false);
                if($scope.incomingWastes){
                $scope.difference = $scope.incomingWastes.length - $scope.wastes.length;
                }
                console.log("this is working");
            }, 5000) //5 segundos para hacer la retroalimentacion de Publicaciones
            
            $scope.setNewWastes = function(){
                $scope.wastes = angular.copy($scope.incomingWastes);
                $scope.incomingWastes = undefined;
            }
            getWastes(true);
            
        }]);
}());