"use strict";
//TODO: clicking where you want slider to go makes it move too
//only moving slider should cause anything, not clicking the slider box.
var ngApp = angular.module('roleApp', ['rzModule', 'ngTouch']);

ngApp.controller('roleController', function($scope) {

  //initialization
  $scope.gameHasStarted = false;
  $scope.gameHasEnded = false;
  $scope.showPlayerButtons = false;
  $scope.gameStatus = "preGameDisplay";
  $scope.roleShowing = false;
  // pull from local storage if available
  $scope.player = JSON.parse(localStorage.getItem('savedPlayers'));

  $scope.handlePlayerInputKeydown = function(event) {
    if (event.which === 13) {
      event.preventDefault();
      event.target.nextElementSibling.focus();
    }
  };

  new Dragdealer('slide-to-unlock-old', {
    steps: 2,
    callback: function(x, y) {
      // Only 0 and 1 are the possible values because of "steps: 2"
      if (x) {
        this.disable();
        $('#slide-to-unlock-old').fadeOut();
      }
    }
  });

  // TODO: Instead of using a separate checkedPlayerArray, let the player object have a "checked" property
  $scope.statsChecked = function(value) {
    return $scope.checkedPlayerArray.indexOf(value) > -1;
  };

  // TODO: Function should just be isStartRead to return a boolean, which the start button uses for ng-disabled
  // Then, CSS style :disabled (or [disabled]? i forget) with gray
  $scope.assignButtonGreyOrGreen = function() {
    var playerNames = new Array;
    //var uniquePlayers = false;
    // TODO: "player" is confusing, need a "players" *array*
    // Then, you'll just check the length of that array without this processing every time
    for(var i in $scope.player) {
      var thisPlayer = $scope.player[i];
      if (thisPlayer) {
        playerNames.push(thisPlayer.toUpperCase());
      }
    }


    var sortedPlayerArray = playerNames.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });

    console.log(sortedPlayerArray);

    function uniquePlayers() {
      for(i = 0; i < sortedPlayerArray.length; i++) {
        if(sortedPlayerArray[i] === sortedPlayerArray[i+1]) {
          return false;
        }
      }
      return true;
    }


    if (playerNames.length  >= 5 && uniquePlayers()) {
      $scope.isStartReady = 'green';
      $scope.enoughPlayers = false;
    } else {
      $scope.isStartReady = 'grey';
      $scope.enoughPlayers = true;
    }

    // TODO: This is basically the model you should be using all along
    $scope.playerArray = playerNames;
  };

  // TODO: remove once the models are fixed
  $scope.assignButtonGreyOrGreen();

  $scope.createPlayerSliders = function() {
    $scope.sliders = {};
    $scope.playerArray.forEach(function(playerName) {
      console.log($scope.sliders);
      $scope.sliders[playerName] = {playerName: playerName};

      $scope.sliders[playerName].role = {
        locked: false,
        minValue: 0,
        maxValue: 100,
        options: {
          floor: 0,
          ceil: 100,
          draggableRange: true,
          onEnd: function(id, value) {
            var thisSlider = $scope.sliders[playerName];
            if (value >= 80) {
              thisSlider.role.locked = true;
              thisSlider.role.minValue = 100;
              thisSlider.role.options.disabled = true;
              $scope.showPlayerButtons = false;
              $scope.showRole(thisSlider.playerName);
            } else if (!thisSlider.role.locked) {
              thisSlider.role.minValue = 0;
            }
          }
        }
      };

      $scope.sliders[playerName].scrutiny = {
        locked: false,
        minValue: 0,
        maxValue: 100,
        options: {
          floor: 0,
          ceil: 100,
          draggableRange: true,
          onEnd: function(id, value) {
            if (value === 100) {
              console.log(value);
              $scope.showRole($scope.sliders[playerName].playerName);
            }
          }
        }
      }

    });
  };

  $scope.assignRoles = function() {
    localStorage.setItem('savedPlayers', JSON.stringify($scope.player));
    $scope.showPlayerButtons = true;
    $scope.createPlayerSliders();
    // TODO: Remove this dead code!
    $scope.playerInputHiddenOrShown = [];
    $scope.playerInputHiddenOrShown.push("hide");
    $scope.doneViewingText = "Done Viewing";
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
    var thisGamesNumbers = new createNewGameNumbers($scope.playerArray.length);
    thisGamesAssignment.assign(thisGamesNumbers);
    $scope.playerNum = thisGamesNumbers.players;
    $scope.scrutinies = thisGamesNumbers.scrutinies;
  };

  function createNewGameNumbers(playerNum) {
    this.players = playerNum;
    this.hitler = 1;
    // TODO: switch case
    switch (playerNum) {
      case 5 :
        this.liberals = 3;
        this.fascists = 2;
        this.scrutinies = 0;
        break;

      case 6:
        this.liberals = 4;
        this.fascists = 2;
        this.scrutinies = 0;
        break;

      case 7 :
        this.liberals = 4;
        this.fascists = 2;
        this.scrutinies = 1;
        break;

      case 8:
        this.liberals = 5;
        this.fascists = 2;
        this.scrutinies = 1;
        break;

      case 9:
        this.liberals = 5;
        this.fascists = 3;
        this.scrutinies = 2;
        break;

      case 10:
        this.liberals = 6;
        this.fascists = 3;
        this.scrutinies = 2;
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
    $scope.allScrutiniesUsed = $scope.scrutinizedPlayerArray.length === $scope.scrutinies;
    $scope.gameHasStarted = true;
    // TODO: String should be built in the HTML, not in the JS
    // Use something like {{thisPresident}} is PRESIDENT
    $scope.thisPresident =  $scope.checkedPlayerArray[i_randomPresident] + " is PRESIDENT";
  };

  $scope.hideRole = function() {
    if ($scope.gameHasEnded) {
      location.reload();
      return;
    }

    $scope.desc = "";
    $scope.roleShowing = false;
    $scope.showPlayerButtons = true;

    // TODO: cleanup all console logs when done (if done)
    if ($scope.checkedPlayerArray.length == $scope.playerNum) {
      $scope.allChecked = true;
    }
  };

  $scope.showRole = function(value) {
    $scope.roleShowing = true;
    $scope.showPlayerButtons = false;

    var playerObj = $scope.playerObj;

    if ($scope.gameHasEnded) {
      displayRoles("FASCIST", value);
      $scope.doneViewingText = "New Game";
    }

    //show role after game starts
    else if ($scope.gameHasStarted === true ) {
      console.log("yo");
      $scope.thisPresident = "";
      if (playerObj.liberals.indexOf(value) > -1) {
        displayRoles("LIBERAL", value)
      } else if (playerObj.fascists.indexOf(value) > -1 || playerObj.hitler.indexOf(value) > -1)  {
        displayRoles("FASCIST", value);
      }

      $scope.scrutinizedPlayerArray.push(value);
      $scope.allScrutiniesUsed = $scope.scrutinizedPlayerArray.length === $scope.scrutinies;
      // displayRoles("FASCIST", $scope.playerObj.fascists[0], playerObj.fascists.concat(playerObj.hitler));

      //console.log($scope.allScrutiniesUsed);
      return;
    }

    //show role before game starts
    else {
      if (playerObj.liberals.indexOf(value) > -1) {
        displayRoles("LIBERAL", value)
      } else if (playerObj.fascists.indexOf(value) > -1) {
        displayRoles("FASCIST", value);
      } if (playerObj.hitler.indexOf(value) > -1) {
        displayRoles("HITLER", value);
      }
    }

    $scope.checkedPlayerArray.push(value);

    //this should have an object passed into it, parsed to include only wanted players
    //rather than an array passed in
    function displayRoles(role, thisPlayer) {
      //console.log("in here", role, thisPlayer);

      //if liberal, show just one liberal
      //else if pregame
      // if fascists show fascist, then show hitler
      //  else if hitler and more than 6, show only hitler
      //////else show fascists
      //else if ingame
      ////if fascists, show only that fascist
      ////if hitler, show as fascist
      //else if postgame
      ////show fascists, then hitler

      $scope.desc = [];
      $scope.desc.push(thisPlayer + " is " + role);
      var player_i = "";

      if ($scope.gameHasEnded || !$scope.gameHasStarted) {
        console.log(role);
        if (role === "FASCIST") {
          var fascists = playerObj.fascists;
          for (var i = 0; i < fascists.length; i++) {
            player_i = fascists[i];

            if (thisPlayer != player_i) {
              $scope.desc.push(player_i + " is " + "FASCIST");
            }
          }

          $scope.desc.push(playerObj.hitler[0] + " is " + "HITLER");
        }

        if (role === "HITLER" && $scope.playerNum < 7) {
          $scope.desc.push(playerObj.fascists[0] + " is " + "FASCIST")
        }
      } else if ($scope.gameHasStarted && role === "HITLER") {
        $scope.desc.push(thisPlayer +  " is " + "FASCIST")
      }


      console.log($scope.desc);
    }

    $scope.showEndGameDeets = function() {
      if ($scope.allScrutiniesUsed) {
        $scope.thisPresident = "";
      }
      $scope.gameHasEnded = true;
      $scope.gameStatus = "endGameDisplay";
      $scope.showRole($scope.playerObj.fascists[0]);
      //console.log($scope.playerObj);
      //displayRoles("FASCIST", $scope.playerObj.fascists[0], playerObj.fascists.concat(playerObj.hitler));
    };
  };

  $scope.startGame = function() {
    var i_randomPresident = Math.floor(Math.random()*$scope.playerNum);
    $scope.scrutinizedPlayerArray = [];
    $scope.gameHasStarted = true;

    // TODO: String should be built in the HTML, not in the JS
    // Use something like {{thisPresident}} is PRESIDENT
    $scope.thisPresident =  $scope.checkedPlayerArray[i_randomPresident] + " is PRESIDENT";
  };



  function changePic(evt){
    //bring selected photo in
    //get files captured through input
    var fileInput = evt.target.files;
    if(fileInput.length > 0) {
      //get the file
    }

    //window url
    var windowURL = window.URL || window.webkitURL;

    //picture url
    var picURL = windowURL.createObjectURL(fileInput[0]);

    console.log(picURL);
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

//kyu ni
//shupcho
//