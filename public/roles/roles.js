"use strict";

var ngApp = angular.module('roleApp', []);

ngApp.controller('roleController', function($scope) {
  //initialization
  $scope.gameHasStarted = false;
  $scope.showPlayerButtons = false;

  $scope.handlePlayerInputKeydown = function(event) {
    if (event.which === 13) {
      event.preventDefault();
      event.target.nextElementSibling.focus();
    }
  };

  // TODO: Instead of using a separate checkedPlayerArray, let the player object have a "checked" property
  $scope.statsChecked = function(value) {
    return $scope.checkedPlayerArray.indexOf(value) > -1;
  };

  // TODO: Function should just be isStartRead to return a boolean, which the start button uses for ng-disabled
  // Then, CSS style :disabled (or [disabled]? i forget) with gray
  $scope.assignButtonGreyOrGreen = function() {
      var playerNames = new Array;

      // TODO: "player" is confusing, need a "players" *array*
      // Then, you'll just check the length of that array without this processing every time
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

    // TODO: This is basically the model you should be using all along
    $scope.playerArray = playerNames;
  };


  $scope.assignRoles = function() {
    $scope.showPlayerButtons = true;
    // TODO: Remove this dead code!
    $scope.playerInputHiddenOrShown = [];
    $scope.playerInputHiddenOrShown.push("hide");
    //assign to each player a random role from the available roles
    //for (var playerNum in $scope.player) {
    //  //if (assignedPlayersRoles[i] === 0 )
    //  console.log($scope.player[playerNum].toUpperCase);
    //}

    // TODO: by convention, classes are ALWAYS capitalized
    // TODO: code review the assignment phase
    var thisGamesAssignment =  new playerAssignment($scope.playerArray);
    $scope.playerObj = thisGamesAssignment;
    // TODO: remove TODO
    //TODO: make 7 mutable
    var thisGamesNumbers = new playerNumberObj($scope.playerArray.length);
    thisGamesAssignment.assign(thisGamesNumbers);
    $scope.playerNum = thisGamesNumbers.players;
  };

  function playerNumberObj(playerNum) {
    this.players = playerNum;
    this.hitler = 1;
    // TODO: switch case
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

  $scope.checkedPlayerArray = [];

  $scope.startGame = function() {
    var playerList = $scope.checkedPlayerArray;
    var i_randomPresident = Math.floor(Math.random()*$scope.playerNum);
    $scope.scrutinizedPlayerArray = [];
    $scope.gameHasStarted = true;
    // TODO: String should be built in the HTML, not in the JS
    // Use something like {{thisPresident}} is PRESIDENT
    $scope.thisPresident =  $scope.checkedPlayerArray[i_randomPresident] + " is PRESIDENT";
    console.log("start Game", playerList);
  };

  $scope.hideRole = function() {
    $scope.desc = "";
    $scope.roleShowing = false;
    $scope.showPlayerButtons = true;

    // TODO: cleanup all console logs when done (if done)
    console.log("roles are showing!");
    console.log($scope.checkedPlayerArray, "checked");
    console.log($scope.checkedPlayerArray.length, $scope.playerNum);

    if ($scope.checkedPlayerArray.length == $scope.playerNum) {
      $scope.allChecked = true;
    }
  };

  $scope.showRole = function(value) {

    $scope.roleShowing = true;
    $scope.showPlayerButtons = false;
    console.log("roles are showing!");

    var playerObj = $scope.playerObj;

    //show role after game starts
    if ($scope.gameHasStarted === true) {
      $scope.thisPresident = "";
      if (playerObj.liberals.indexOf(value) > -1) {
        displayRoles("LIBERAL", value)
      } else if (playerObj.fascists.indexOf(value) > -1 || playerObj.hitler.indexOf(value) > -1)  {
        displayRoles("FASCIST", value);
      }

      $scope.scrutinizedPlayerArray.push(value);
      return;
    }

    //show role before game starts
    if (playerObj.liberals.indexOf(value) > -1) {
      displayRoles("LIBERAL", value)
    } else if (playerObj.fascists.indexOf(value) > -1) {
      displayRoles("FASCIST", value, playerObj.fascists.concat(playerObj.hitler));
    }  if (playerObj.hitler.indexOf(value) > -1) {
      displayRoles("HITLER", value, playerObj.hitler);
    }

    $scope.checkedPlayerArray.push(value);

    function displayRoles(role, thisPlayer, thosePlayers) {
      $scope.desc = [];
      $scope.desc.push(thisPlayer + " is " + role);
      if (thosePlayers) {
        for (var i = 0; i < thosePlayers.length; i++) {
          if(i === thosePlayers.length-1 && role === "FASCIST") {
            role = "HITLER";
          }
          if (thisPlayer != thosePlayers[i]) {
            $scope.desc.push(thosePlayers[i] + " is " + role);
          }
        }
      }
    }
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