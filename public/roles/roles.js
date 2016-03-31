"use strict";

var ngApp = angular.module('roleApp', []);

ngApp.controller('roleController', function($scope) {
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

    $scope.playerArray = playerNames;
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

    var thisGamesAssignment =  new playerAssignment($scope.player);
    console.log(thisGamesAssignment);
    //TODO: make 7 mutable
    var thisGamesNumbers = new playerNumberObj(Object.keys($scope.player).length);
    thisGamesAssignment.assign(thisGamesNumbers);
  };

  function playerNumberObj(playerNum) {
    this.players = playerNum;
    this.hitler = 1;
    if (playerNum === 7) {
      this.liberals = 4;
      this.fascists = 2;
    } else if (playerNum === 8) {
      this.liberals = 5;
      this.fascists = 2;
    } else if (playerNum === 9) {
      this.liberals = 5;
      this.fascists = 3;
    } else if (playerNum === 10) {
      this.liberals = 6;
      this.fascists = 3;
    }
  }

  function playerAssignment(playerObj) {
    var playerArray =  $scope.playerArray;
    this.liberals = [];
    this.fascists = [];
    this.hitler = [];
    this.assign = function(numberOfPlayers) {

      var liberals = numberOfPlayers.liberals;
      var fascists = numberOfPlayers.fascists;
      var hitlers = numberOfPlayers.hitler;
      var players = numberOfPlayers.players;
      for (var i = 0; i < players; i++) {
        var currentLength = playerArray.length;
        var i_rand = Math.floor(Math.random() * currentLength);
        if (currentLength > players - liberals) {
          this.liberals.push(playerArray[i_rand]);
        } else if (currentLength > hitlers) {
          this.fascists.push(playerArray[i_rand]);
        } else {
          this.hitler.push(playerArray[i_rand]);
        }
        playerArray.splice(i_rand, 1);
      }
      console.log(playerArray);
    }
  }

  $scope.showRole = function(value) {
    console.log(value);
  }

});

//assign all the numbers to a color
//var randArrIndex = 0;
//for (var key in theseCards) {
//  var cardType = theseCards[key];
//  while (cardType.assigned < cardType.wordNum) {
//    $("#codeWord_" + assignmentDone[randArrIndex]).addClass("cardType_" + key);
//    randArrIndex ++;
//    cardType.assigned ++;
//  }
//}
//
//while(assignmentDone.length < gameSize){
//  var randNum = Math.floor(Math.random()* 25);
//  if(assignmentDone.indexOf(randNum) === -1) {
//    assignmentDone.push(randNum);
//  }
//}