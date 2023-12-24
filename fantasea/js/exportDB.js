var dbExporter = new function() {

  this.exportLoadedPlayers = function() {
    var exported = [];
    var expPlayer = {};
    var oldStat = "powerplayPoints";
    var newStat = "powerPlayPoints";
    //for (var player in tableMgr.loadedPlayers) {
      // Loop on the player's categories
      /*for (var i = 0; i <  Object.getOwnPropertyNames(tableMgr.loadedPlayers[player]).length; ++i) {
        // If belonging to category of no interest
        if (tableMgr.categories[i] !== undefined && !hockey.categoryIsScore(tableMgr.categories[i])) {
          // Add the category to the player as is
          expPlayer[Object.getOwnPropertyNames(tableMgr.loadedPlayers[player])[i]] = Object.values(tableMgr.loadedPlayers[player])[i];
        }
        // Otherwise, modify the category here :
        else {

          //expPlayer[newStat] = Object.values(tableMgr.loadedPlayers[player])[i];
        }
      }
*/
      for (var player in tableMgr.loadedPlayers) {
        expPlayer = tableMgr.loadedPlayers[player];
        if (expPlayer.yScore !== undefined) {
          delete expPlayer.yScore;
        }
        if (expPlayer.yNoSchedScore !== undefined) {
          delete expPlayer.yNoSchedScore;
        }
        if (expPlayer.ehjScore !== undefined) {
          delete expPlayer.ehjScore;
        }
        if (expPlayer.teamConflictRating !== undefined) {
          delete expPlayer.teamConflictRating;
        }
        if (expPlayer.teamOffDays !== undefined) {
          delete expPlayer.teamOffDays;
        }
        if (expPlayer.fScore !== undefined) {
          delete expPlayer.fScore;
        }
        if (expPlayer.positionsPlayed !== undefined) {
          delete expPlayer.positionsPlayed;
        }

        exported.push(expPlayer);
      }


    console.log("var playersJson18 = " + JSON.stringify(exported) + ";");
  }
/*
  this.exportCurrentDbFromTable = function() {
    var players = [];
    var currentPlayer = "";

    $("#player_stats_table").children().each(function(index) {
      var currentRow = $(this);

      // Handle the ID separately
      for(var i = 1; i < tableMgr.categories.notes + 1; ++i) {
          console.log(Object.getOwnPropertyNames(tableMgr.categories)[i]);
      }

      currentPlayer = {
        id: parseInt(currentRow.attr('id').substring(7), 10),
        position: currentRow.children(".position_cell").html(),
        name: currentRow.children(".name_cell").html(),//.replace("'", "\\'"),
        age: currentRow.children(".age_cell").html(),
        currentTeam: currentRow.children(".current_team_cell").html(),
        depth: { last: currentRow.children(".depth_cell.last_stat").html(), projected: currentRow.children(".depth_cell.projected_stat").html()
        },
        goals: { last: currentRow.children(".goals_scored_cell.last_stat").html(), projected: currentRow.children(".goals_scored_cell.projected_stat").html()},
        assists: { last: currentRow.children(".assists_cell.last_stat").html(), projected: currentRow.children(".assists_cell.projected_stat").html()},
        points: { last: currentRow.children(".points_cell.last_stat").html(), projected: currentRow.children(".points_cell.projected_stat").html()},
        powerplayPoints: { last: currentRow.children(".powerplay_points_cell.last_stat").html(), projected: currentRow.children(".powerplay_points_cell.projected_stat").html()},
        shorthandedPoints: { last: currentRow.children(".shorthanded_points_cell.last_stat").html(), projected: currentRow.children(".shorthanded_points_cell.projected_stat").html()},
        plusMinus: { last: currentRow.children(".plus_minus_cell.last_stat").html(), projected: currentRow.children(".plus_minus_cell.projected_stat").html()},
        penaltyMinutes: { last: currentRow.children(".penalty_minutes_cell.last_stat").html(), projected: currentRow.children(".penalty_minutes_cell.projected_stat").html()},
        shotsOnGoal: { last: currentRow.children(".shots_on_goal_cell.last_stat").html(), projected: currentRow.children(".shots_on_goal_cell.projected_stat").html()},
        hits: { last: currentRow.children(".hits_cell.last_stat").html(), projected: currentRow.children(".hits_cell.projected_stat").html()},
        shotsBlocked: { last: currentRow.children(".blocked_shots_cell.last_stat").html(), projected: currentRow.children(".blocked_shots_cell.projected_stat").html()},
        gamesPlayed: currentRow.children(".games_played_cell").html(),
        timeOfIce: { last: currentRow.children(".time_of_ice_cell.last_stat").html(), projected: currentRow.children(".time_of_ice_cell.projected_stat").html()},
        notes: currentRow.children(".notes_cell").html()
      };

      while (currentPlayer.timeOfIce.last.length < 5) {
        if (currentPlayer.timeOfIce.last.length == 2) {
          currentPlayer.timeOfIce.last = ":" + currentPlayer.timeOfIce.last;
        }
        else {
          currentPlayer.timeOfIce.last = "0" + currentPlayer.timeOfIce.last;
        }
      }
      players.push(currentPlayer);
    });
    console.log(JSON.stringify(players));
  };*/
}
