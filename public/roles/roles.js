"use strict";

var ngApp = angular.module('roleApp', []);

ngApp.controller('roleController', function($scope, $window) {
  //initialization
  $scope.playerButtonListHiddenOrShown = [];
  $scope.playerButtonListHiddenOrShown.push("hide");

  $scope.buttonCheck = function() {
      var playerNames = new Array;

      for(var i in $scope.player) {
        playerNames.push($scope.player[i]);
      }

      if (playerNames.length  >= 7) {
        $scope.isStartReady = 'green';
      } else {
        $scope.isStartReady = 'grey';
      }
  };


  $scope.startGame = function() {
    $scope.playerButtonListHiddenOrShown.pop("hide");
    $scope.playerInputHiddenOrShown = [];
    $scope.playerInputHiddenOrShown.push("hide");
    //assign to each player a random role from the available roles
    for (var playerNum in $scope.player) {
      //if (assignedPlayersRoles[i] === 0 )
      console.log($scope.player[playerNum]);
    }

  };


});