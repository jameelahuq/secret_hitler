"use strict";

var ngApp = angular.module('roleApp', []);

ngApp.controller('roleController', function($scope) {
  //initialization
  $scope.playerButtonListHiddenOrShown = [];
  $scope.playerButtonListHiddenOrShown.push("hide");
  $scope.gameHasStarted = false;

  $scope.assignButtonGreyOrGreen = function() {
      var playerNames = new Array;

      for(var i in $scope.player) {
        playerNames.push($scope.player[i].toUpperCase());
      }

      if (playerNames.length  >= 7) {
        $scope.isStartReady = 'green';
        $scope.enoughPlayers = false;
      } else {
        $scope.isStartReady = 'grey';
        $scope.enoughPlayers = true;

      }

    $scope.playerArray = playerNames;
  };


  $scope.assignRoles = function() {
    $scope.playerButtonListHiddenOrShown.pop("hide");
    $scope.playerInputHiddenOrShown = [];
    $scope.playerInputHiddenOrShown.push("hide");
    //assign to each player a random role from the available roles
    //for (var playerNum in $scope.player) {
    //  //if (assignedPlayersRoles[i] === 0 )
    //  console.log($scope.player[playerNum].toUpperCase);
    //}

    var thisGamesAssignment =  new playerAssignment($scope.playerArray);
    $scope.playerObj = thisGamesAssignment;
    //TODO: make 7 mutable
    var thisGamesNumbers = new playerNumberObj($scope.playerArray.length);
    thisGamesAssignment.assign(thisGamesNumbers);
    $scope.playerNum = thisGamesNumbers.players;
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

  function playerAssignment(playerArray) {
    this.liberals = [];
    this.fascists = [];
    this.hitler = [];
    var playerArray = playerArray.slice();
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
    };
  }

  $scope.statsChecked = function(value) {
    return $scope.checkedPlayerArray.indexOf(value) > -1;
  };

  $scope.checkedPlayerArray = [];

  $scope.hideRole = function() {
      $scope.desc = "";
      $scope.roleShowing = false;
      $scope.isNoneOrBlock = "block";
    console.log($scope.checkedPlayerArray.length, $scope.playerNum);
      if ($scope.checkedPlayerArray.length == $scope.playerNum) {
        $scope.allChecked = true;
      }
  };

  $scope.startGame = function() {
    var playerList = $scope.checkedPlayerArray;
    var i_randomPresident = Math.floor(Math.random()*$scope.playerNum);
    $scope.gameHasStarted = true;
    $scope.thisPresident =  $scope.checkedPlayerArray[i_randomPresident] + " is PRESIDENT";
  };

  $scope.showRole = function(value) {
    if ($scope.gameHasStarted === true) {
      return;
    }
    $scope.roleShowing = true;
    $scope.isNoneOrBlock = 'none';

    var playerObj = $scope.playerObj;

    if (playerObj.liberals.indexOf(value) > -1) {
      $scope.desc = "liberal";
    }  if (playerObj.fascists.indexOf(value) > -1) {
      console.log("red", playerObj.fascists, playerObj.hitler );
      $scope.desc = "fascist: " + playerObj.fascists + " hitler: " + playerObj.hitler;
    }  if (playerObj.hitler.indexOf(value) > -1) {
      console.log("hiterler stash");
      $scope.desc = "hiterler";
    }
    $scope.checkedPlayerArray.push(value);


  };


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