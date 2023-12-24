$(function() {
posDepthFilter.initialize();
  tableMgr.initialize();
  //tableMgr.loadPlayersFromHockeyReferenceCsv();
  // Watch out for exportDB when absolutism is disabled
  options.initialize();


});

var tableMgr = new function() {
  //var path = "players.csv";

  this.htmlOutput = "";

  this.statTable = $('#player_stats_table');
  this.loadedPlayers = [];
  this.filteredPlayers = [];

  this.currentSort = {};

  this.categories = [ hockey.categories.position, hockey.categories.name, hockey.categories.age, hockey.categories.currentTeam, hockey.categories.gamesPlayed, hockey.categories.teamConflictRating, hockey.categories.teamOffDays, hockey.categories.ppUnit, hockey.categories.ehjScore, hockey.categories.depth, hockey.categories.goals, hockey.categories.assists, hockey.categories.points, hockey.categories.powerPlayPoints, hockey.categories.plusMinus, hockey.categories.shotsOnGoal, hockey.categories.shotPercentage, hockey.categories.hits, hockey.categories.blockedShots, hockey.categories.timeOfIce, hockey.categories.notes];

    // Boundaries of the absolutism-relevant stats
    // Note that boundaries indicate the "status change" ie the "start" boundary is the first category that is affected by absolutism but the "end" boundary is the first category not to be affected by absolutism again. The reason for this is to simplify for loops on the range defined by the boundaries, where the looping condition is set to i < "end"
    this.absolutismStartCat = this.categories.findIndex(function(e) { return e == hockey.categories.goals });
    this.absolutismEndCat = this.categories.findIndex(function(e) { return e == hockey.categories.timeOfIce });

    // Split columns boundaries define the columns which are split in two+ in order to display both the player's last value and his projected value for this category
    this.splitColumnsStart = this.categories.findIndex(function(e) { return e == hockey.categories.ppUnit });;
    this.splitColumnsEnd = this.categories.findIndex(function(e) { return e == hockey.categories.notes });;

    // Boundaries of the stats used to compute a player's FScore
    this.fScoreStart = this.categories.findIndex(function(e) { return e == hockey.categories.goals });;
    this.fScoreEnd = this.categories.findIndex(function(e) { return e == hockey.categories.timeOfIce });;

  this.categoryRanges = {
    all: "all",
    last: "last",
    projected: "projected"
  }

  this.getAbsolutedStat = function(stat, gamesPlayed, absolutism) {
    if (absolutism == options.absolutismOptions.total) {
      return stat;
    }
    // Catch division by 0
    else if (gamesPlayed == 0) {
        return 0;
    }
    else if (absolutism == options.absolutismOptions.perGame) {
      return (stat / gamesPlayed).toFixed(2);//(category == tableMgr.categories.plusMinus ? 1 : 1);
    }
    else if (absolutism == options.absolutismOptions.perFullSeason) {
      return (stat / gamesPlayed * hockey.gamesPerSeason).toFixed(0);
    }
  }


  this.getCategoryFromSubheader = function(id) {
    // The identifier is the part of the element's ID that represents the category, ie "last_goals"; it is located after the only underscore
    var identifier = id.substring(id.indexOf("_") + 1);

    return tableMgr.categories.find(function(elem) { return elem.str == identifier });

  }
  this.getCategoryFromHeader = function(id) {
    var identifier = id.substring(id.indexOf("_") + 1);
    identifier = identifier.substring(0, identifier.indexOf("_"));

    return tableMgr.categories.find(function(elem) { return elem.str == identifier; });
  }

  // Return the range specified by a subheader cell
  this.getRangeFromSubheader = function(id) {
    // First four characters of a subheader range cell are either "last" or "proj"
    return id.substring(0, 4) == 'last' ? tableMgr.categoryRanges.last : tableMgr.categoryRanges.projected;
  }
    // Builds a player's stats' row
    this.buildPlayerRow = function(player) {
      // The row in question, as an HTML element
      var row = "";
      // If a player is defined (otherwise nothing is done)
      if (player != "") {
        // Initialize the row by opening the <tr> tag, labelling it with the player's ID in order to fetch the player from the HTML row later, if necessary
        row += "<tr class=\"player_row" + (player.drafted ? " drafted" : "") + "\" id=\"player_" + player.id + "\">";

        // Loop on all shown categories
        for (var cat = 0; cat < tableMgr.categories.length; ++cat) {

            // If the column is split
            if (cat >= tableMgr.splitColumnsStart && cat < tableMgr.splitColumnsEnd) {
              // Open the <td> for the "last" stat's data cell, insert the value, close </td> and repeat for the "projected" stat's data cell; The value alternates depending on whether the category is affected by absolutism or not because getAbsolutedStat does not currently handle non-absoluted stats input
              row += "<td class=\"data_cell " + hockey.categories[tableMgr.categories[cat].str].id + "_cat_cell last_stat\">" + (cat >= tableMgr.absolutismStartCat && cat < tableMgr.absolutismEndCat && tableMgr.categories[cat] != hockey.categories.shotPercentage ? tableMgr.getAbsolutedStat(tableMgr.getPlayerCategory(player, cat, tableMgr.categoryRanges.last), player.gamesPlayed, options.absolutism) : tableMgr.getPlayerCategory(player, cat, tableMgr.categoryRanges.last)) + "</td><td class=\"data_cell " + hockey.categories[tableMgr.categories[cat].str].id + "_cat_cell projected_stat\" " + (tableMgr.categories[cat] != hockey.categories.shotPercentage ? "contenteditable=\"true\"" : "") + ">" + (cat >= tableMgr.absolutismStartCat && cat < tableMgr.absolutismEndCat ? tableMgr.getAbsolutedStat(tableMgr.getPlayerCategory(player, cat, tableMgr.categoryRanges.projected), hockey.gamesPerSeason, options.absolutism == options.absolutismOptions.perGame ? options.absolutismOptions.perGame : options.absolutismOptions.total) : tableMgr.getPlayerCategory(player, cat, tableMgr.categoryRanges.projected)) + "</td>";
            }
            // Otherwise, this category's column is whole so only a single cell needs to be added
            else {
              // Open the data cell's <td> tag, fill in the category using the "last" value range by default and close the </td>; Make the content editable for the notes cell; Insert the fscore if needed, otherwise fetch the appropriate stat
                row += "<td class=\"data_cell " + hockey.categories[tableMgr.categories[cat].str].id + "_cat_cell\" " + (tableMgr.categories[cat] == hockey.categories.notes || tableMgr.categories[cat] == hockey.categories.position ? "contenteditable=\"true\"" : "") + ">" + (tableMgr.getPlayerCategory(player, cat, tableMgr.categoryRanges.last)) + "</td>";

            }
          }
        // Add the action buttons
        row += "<td class=\"action_cell draft_cell draft_button\" tab=\"0\">Draft</td>";
        row += "<td class=\"action_cell commit_cell commit_button\" tabindex=\"0\">Commit</td>";

        // Add the row to the html output and close the </tr>
        return row + "</tr>";
      }
    };


    this.nextFocus = function(currentFocus) {
      // KISS because contenteditable is sloppy and not an ideal long term solution
      // The category displayed with this cell is contained as the first characters of the 2nd (index 1) class attribute of the cell; If the category is notes, the row is about to end
      if (currentFocus.classList[1].substring(0, currentFocus.classList[1].indexOf("_")) == tableMgr.categories.notes) {
        $(currentFocus).next(".action_cell").focus();
      }
      // Otherwise just skip ahead 2 cells, to skip the unfocusable "last" cell
      else {
        $(currentFocus).next("td").next("td").focus();
      }
    }


    this.commitRow = function(event) {
      // Get the row as the parent of the commit button cell
      var row = event.target.parentElement;
      // Get the player ID from the row's ID
      var playerId = row.id.substring(7);
      // HTML identifier of the committed cell
      var valueHtml = "";
      // Value of the cell whose information is being committed
      var value = "";
      // Filtered information
      var projectedValue = "";

      // Find the committed player from the filtered list
      var filteredPlayer = tableMgr.filteredPlayers[tableMgr.filteredPlayers.findIndex(function(player) {
        return player.id == playerId;
      })];

      // And again in the loaded players' list
      var loadedPlayer = tableMgr.loadedPlayers[tableMgr.loadedPlayers.findIndex(function(player) {
        return player.id == playerId;
      })];

      // Update the position
      valueHtml = "." + hockey.categories.position.id + "_cat_cell";
      value = $(row).children(valueHtml)[0].innerHTML;
      filteredPlayer[hockey.categories.position.str] = value;

      // Update the information
      for (var cat = tableMgr.splitColumnsStart; cat < tableMgr.splitColumnsEnd; ++cat) {
          valueHtml = "." + tableMgr.categories[cat].id + "_cat_cell.projected_stat";

          // Raw value
          value = $(row).children(valueHtml)[0].innerHTML;
          // Final value (trim off the contenteditable bs)
          projectedValue = value.substring(0, value.indexOf("<br>") == -1 ? value.length : value.indexOf("<br>"));

          if (cat >= tableMgr.splitColumnsStart && cat < tableMgr.splitColumnsEnd) {

            // Hand-pick certain categories for special treatment
            // Category is points, no projected value has been manually entered, both goals and assists have some value
            if (tableMgr.categories[cat].id == hockey.categories.points.id && projectedValue == "" && filteredPlayer[hockey.categories.goals.str].projected != "" && filteredPlayer[hockey.categories.assists.str].projected != "") {
              projectedValue = parseInt(filteredPlayer[hockey.categories.goals.str].projected, 10) + parseInt(filteredPlayer[hockey.categories.assists.str].projected, 10);

              console.log("Auto-filling " + filteredPlayer.name + "'s points : " + projectedValue + " ( " + parseInt(filteredPlayer[hockey.categories.goals.str].projected, 10) + "G " + parseInt(filteredPlayer[hockey.categories.assists.str].projected, 10) + "A )");
            }

            // If the player's category value is not undefined and the value is not a score
            if (filteredPlayer[tableMgr.categories[cat].str] !== undefined && tableMgr.categories[cat].id != hockey.categories.yNoSchedScore.id && tableMgr.categories[cat].id != hockey.categories.yScore.id) {
              filteredPlayer[tableMgr.categories[cat].str].projected = projectedValue;
              loadedPlayer[tableMgr.categories[cat].str].projected = projectedValue;
            }
          }
        //}
      }

      // save the notes!
      valueHtml = "." + hockey.categories.notes.id + "_cat_cell";
      filteredPlayer[hockey.categories.notes.str] = ($(row).children(valueHtml)[0].innerHTML).substring(0);
      loadedPlayer[hockey.categories.notes.str] = ($(row).children(valueHtml)[0].innerHTML).substring(0);

      dbExporter.exportLoadedPlayers();
    }


    this.updateOutput = function() {
      // Clear any leftover data
      tableMgr.statTable.empty();

      // Add the currently loaded table
      tableMgr.statTable.append(tableMgr.htmlOutput);

      // Add the relevant click listeners
      $('.projected_stat').on('click', hockey.promptProjectedValue);
      $('.commit_button').on('click', tableMgr.commitRow);
      $('.draft_button').on('click', function(event) {
        draft.draftPlayer(tableMgr.getPlayerFromRow(event.target.parentElement));
        tableMgr.checkOff(event);

      });


      // Add a click listener to the name as a check off box for now
      $('.1_cat_cell').on('click', tableMgr.checkOff);

      // Add keyboard listeners for the editable cells
      $('td[contenteditable="true"]').keydown(function(event) {
        // If key pressed was Enter
        if (event.keyCode === 13) {
          tableMgr.nextFocus(event.target);
          return false;
        }
      })

      $('.commit_button').keydown(function(event) {
        // If key pressed was enter
        if (event.keyCode === 13) {
          // Commit the row
          tableMgr.commitRow(event);
        }
      })



      for (var i = 0; i < 101; ++i) {
        //console.log(i + " " + hockey.getFScoreColor(i));
      }
      // Update the absolutist values
      //options.applyAbsolutism();
    };

  this.paintDisplay = function() {


    for (var i = 0; i < tableMgr.categories.length; ++i) {
      if (hockey.categoryIsScore(tableMgr.categories[i]) || (i >= tableMgr.absolutismStartCat && i < tableMgr.absolutismEndCat))
      tableMgr.paintCategoryCell(tableMgr.categories[i]);
    }

    tableMgr.paintCategoryCell(hockey.categories.timeOfIce);
    //tableMgr.paintCategoryCell(hockey.categories.teamOffDays);
    //tableMgr.paintCategoryCell(hockey.categories.teamConflictRating);

  }


  this.paintCategoryCell = function(category) {
    var className = "." + category.id + "_cat_cell";


    $(className).each(function() {
      if (this.innerHTML != "<br>") {
        var player = tableMgr.getPlayerFromRow(this.parentElement);
        if (player.drafted == true) {
          $(this).css('color', '');
          $(this).css('background', 'black');
        }
        else {
          var paintColor = category != hockey.categories.timeOfIce ? colorScale.getCategoryColor(category, this.innerHTML) : colorScale.getTimeOfIceColor(this.innerHTML, player[hockey.categories.position.str]);
          if ($(this).hasClass("projected_stat") || category.id >= 150) {
          $(this).css('color', 'white');
          $(this).css('background', paintColor);
          }
          else {
            $(this).css('color', colorScale.shadeColor(paintColor, -0.1));
            $(this).css('background', colorScale.shadeColor(paintColor, 0.75));
          }
        }
      }
    });

  }

  this.extractValuesFromRow = function(row) {
    var playerLine = "";

    if (row.length != 0) {

      // Split the row between the comas
      var values = row.split(",");
      // Adjust the name, which in this source data contains the hockey-reference.com player's page name
      var fullName = values[1].substring(0, values[1].indexOf("\\"));

      // Load the player's stats onto a JSON object
      playerLine = {
        // Player ID, not playerline ID. A single player can have multiple lines if he played with more than one team during the covered period
        id: values[0],
        name: fullName,
        age: values[2],
        position: values[3],
        currentTeam: values[4],
        gamesPlayed: parseInt(values[5], 10),
        goals: { last: parseInt(values[6], 10) },
        assists: { last: parseInt(values[7], 10) },
        points: { last: parseInt(values[8], 10) },
        plusMinus: { last: parseInt(values[9], 10) },
        penaltyMinutes: { last: parseInt(values[10], 10) },
        evenStrengthGoals: parseInt(values[11], 10),
        powerplayGoals: parseInt(values[12], 10) ,
        shorthandedGoals: parseInt(values[13], 10),
        gameWinningGoals: parseInt(values[14], 10),
        evenStrengthAssists: parseInt(values[15], 10),
        powerplayAssists: parseInt(values[16], 10),
        shorthandedAssists: parseInt(values[17], 10),
        shotsOnGoal: { last: parseInt(values[18], 10) },
        shootingPercentage: parseFloat(values[19]),
        timeOfIce: { last: values[21] },
        blockedShots: { last: parseInt(values[22], 10) },
        hits: { last: parseInt(values[23], 10) },
        faceoffsWon: parseInt(values[24], 10),
        faceoffsLost: parseInt(values[25], 10),
        faceoffPercentage: parseFloat(values[26]),
        pointsShare: parseFloat(values[27]),
        powerplayPoints: { last: parseInt(values[12], 10) + parseInt(values[16], 10) },
        shorthandedPoints: { last: parseInt(values[13], 10) + parseInt(values[17], 10) }
      }

    }

    return playerLine;
  };

  this.applyFilters = function(filters) {
    tableMgr.filteredPlayers = [];
    var l = tableMgr.loadedPlayers.length;
    var allow = false;
    tableMgr.htmlOutput = "";

      for (var i = 0; i < l; ++i) {

        // Filter position (and depth, see filterMgr.filterPosition)
        allow = filterMgr.filterPosition(tableMgr.loadedPlayers[i]);

        // If the player is allowed by the filters
        if (allow) {
          // Push him onto the filtered players array
          tableMgr.filteredPlayers.push(tableMgr.loadedPlayers[i]);
          // Build the player's HTML row
          tableMgr.htmlOutput += tableMgr.buildPlayerRow(tableMgr.loadedPlayers[i]);
        }
      }

      tableMgr.updateOutput();
      // Repaint when the filters change
      tableMgr.paintDisplay();
  };


  this.handleSortClick = function(event) {
    var parent = event.target.parentElement;

    // Sort category - the column by which the players must be sorted; Use the appropriate method whether the target was in the header or the subheader row
    var sortCategory = parent.id == "player_stats_table_header_row" ? tableMgr.getCategoryFromHeader(event.target.id) : tableMgr.getCategoryFromSubheader(event.target.id);

    // The sort category must be referred to by its tableMgr.categories index because that is how the comparePlayers function fetches its sorting instructions
    var sortCategory = tableMgr.categories.findIndex(function(e) { return e.id == sortCategory.id; });

    // Range applied to the filter, in case many ranges are present (default is last/projected)
    var sortRange = parent.id == "players_stats_table_header_row" ? tableMgr.categoryRanges.last : tableMgr.getRangeFromSubheader(event.target.id);

    // Always assume descending (ie ascending == false) because fantasy is usually about the higher numbers:
    // If the last sort category && range are the same as the one clicked (ie "last_goals" was clicked on twice in a row) && the order is currently descending, then the order is ascending: otherwise it is descending
    var ascendingSort = tableMgr.currentSort === {} ? false : tableMgr.currentSort.categoryIndex == sortCategory && tableMgr.currentSort.range == sortRange && !tableMgr.currentSort.ascending ? true : false;

    // Object that details the sorting that should be applied
    var sort = {
      categoryIndex: sortCategory,
      range: sortRange,
      ascending: ascendingSort
    };

    tableMgr.sort(sort);
  }

  // sort is an object that consists of categoryIndex: sortCategoryIndex, range: tableMgr.categoryRanges, ascending: ascendingSort
  this.sort = function(sort) {
    // Register the current sort
    tableMgr.currentSort = sort;

    // Reset the HTML output
    tableMgr.htmlOutput = "";

    // Sort the filtered players' array accordingly
    tableMgr.filteredPlayers.sort(tableMgr.comparePlayers);

    var count = tableMgr.filteredPlayers.length;

    tableMgr.statTable.find('.player_row').sort(function(a, b) {
      return tableMgr.comparePlayers(tableMgr.getPlayerFromRow(a), tableMgr.getPlayerFromRow(b));
    }).appendTo(tableMgr.statTable);

/*    for (var i = 0; i < count; ++i) {
      tableMgr.buildPlayerRow(tableMgr.filteredPlayers[i]);
    }

    tableMgr.updateOutput();*/
  };

  this.getPlayerFromRow = function(row) {
      // Get the player ID from the row's ID
      var id = row.id.substring(7);
      // Find the committed player from the filtered list
      return tableMgr.filteredPlayers[tableMgr.filteredPlayers.findIndex(function(player) {
        return player.id == id;
      })]
  }

  this.checkOff = function(event) {
    // Checked off row
    var row = event.target.parentElement;
    var playerId = row.id.substring(7);

    var filteredPlayer = tableMgr.getPlayerFromRow(row);

    // And again in the loaded players' list
    var loadedPlayer = tableMgr.loadedPlayers[tableMgr.loadedPlayers.findIndex(function(player) {
      return player.id == playerId;
    })];

    // Initialize the player status as unchecked if undefined, otherwise set it to the player's drafted status' value
    var currentStatus = filteredPlayer.drafted === undefined ? false : filteredPlayer.drafted;

    // Check on/off
    filteredPlayer.drafted = !currentStatus;
    loadedPlayer.drafted = !currentStatus;

    if (filteredPlayer.drafted) {
      $(row).addClass("drafted");
    }
    else {
      $(row).removeClass("drafted");
    }
  }

  // Differs from hockey.getPlayerCategory by accepting a category index instead of a category object
  this.getPlayerCategory = function(player, categoryIndex, range) {

    // Return the appropriate property from the Player object, using tableMgr.categories' own properties to find the name of the requested categoryIndex; Add +1 because getOwnPropertyNames(tableMgr.categories)[0] is "none" by default
    try {
      if (categoryIndex >= tableMgr.splitColumnsStart && categoryIndex < tableMgr.splitColumnsEnd) {
        if (tableMgr.categories[categoryIndex] == hockey.categories.shotPercentage) {
          // Catch division by zero
          if (player[hockey.categories.shotsOnGoal.str][range] == 0 || player[hockey.categories.shotsOnGoal.str][range] == "" || player[hockey.categories.shotsOnGoal.str][range] === undefined) {
            return (0).toFixed(1);
          }
          else {
            return ((player[hockey.categories.goals.str][range] / player[hockey.categories.shotsOnGoal.str][range]) * 100).toFixed(1);
          }
        }
        return range == tableMgr.categoryRanges.last ?  player[tableMgr.categories[categoryIndex].str].last : player[tableMgr.categories[categoryIndex].str].projected;
      }
      else {
        return player[tableMgr.categories[categoryIndex].str];
      }
    }
    catch (error) {
      //console.error(player);
      //console.error(categoryIndex);
    }
  }

  this.comparePlayers = function(playerA, playerB) {
    var a = tableMgr.currentSort.ascending ? playerA : playerB;
    var b = a == playerA ? playerB : playerA;

    // If comparing positions
    if (tableMgr.categories[tableMgr.currentSort.categoryIndex].id == hockey.categories.position.id) {
      // For now, sort the players ascending by the position enumeration value; this will be broken when dual eligibility positions are implemented
      return hockey.pos(a.position) - hockey.pos(b.position);
    }
    // If comparing names
    else if (tableMgr.categories[tableMgr.currentSort.categoryIndex].id == hockey.categories.name.id) {
      return a.name.substring(a.name.lastIndexOf(" ")) > b.name.substring(b.name.lastIndexOf(" "));
    }
    // If comparing teams
    else if (tableMgr.categories[tableMgr.currentSort.categoryIndex].id == hockey.categories.currentTeam.id) {
      // If the two player's team is different, return team in alphabetical order; otherwise order with last name
      return a.currentTeam != b.currentTeam ? a.currentTeam < b.currentTeam : a.name.substring(a.name.lastIndexOf(" ")) < b.name.substring(b.name.lastIndexOf(" "));
    }
    // If comparing depth
    else if (tableMgr.categories[tableMgr.currentSort.categoryIndex].id == hockey.categories.depth.id) {
      return a.depth.last < b.depth.last;
    }
    // If comparing time of ice
    else if (tableMgr.categories[tableMgr.currentSort.categoryIndex].id == hockey.categories.timeOfIce.id) {
      return a.timeOfIce[tableMgr.currentSort.range] > b.timeOfIce[tableMgr.currentSort.range];
    }
    // If comparing absolutist values
    else if (tableMgr.currentSort.categoryIndex >= tableMgr.absolutismStartCat && tableMgr.currentSort.categoryIndex < tableMgr.absolutismEndCat) {
        // Compare the two player's relevant category according to tableMgr.currentSort; is descending by default
        return tableMgr.getAbsolutedStat(hockey.getPlayerCategory(a, tableMgr.categories[tableMgr.currentSort.categoryIndex], tableMgr.currentSort.range), tableMgr.currentSort.range == tableMgr.categoryRanges.projected ? hockey.gamesPerSeason : a.gamesPlayed, options.absolutism) - tableMgr.getAbsolutedStat(hockey.getPlayerCategory(b, tableMgr.categories[tableMgr.currentSort.categoryIndex], tableMgr.currentSort.range), tableMgr.currentSort.range == tableMgr.categoryRanges.projected ? hockey.gamesPerSeason : b.gamesPlayed, options.absolutism);
    }
    else {
        // Compare the two player's relevant category according to tableMgr.currentSort; is descending by default
        return hockey.getPlayerCategory(a, tableMgr.categories[tableMgr.currentSort.categoryIndex], tableMgr.currentSort.range) - hockey.getPlayerCategory(b, tableMgr.categories[tableMgr.currentSort.categoryIndex], tableMgr.currentSort.range);
    }
  }

  this.updateAbsolutism = function() {
    var playerCount = 0;
    var player = "";
    var newVal = "";
    var cat = {};

    var htmlCatClass = "";
      // Go over each row :(
      $('.player_row').each(function() {
        player = tableMgr.filteredPlayers[playerCount];

        // Update all the stats affected by absolutism and set them to the associated player's value
        for (var i = tableMgr.absolutismStartCat; i < tableMgr.absolutismEndCat;) {
          // HTML class selector for this category
          htmlCatClass = "." + tableMgr.categories[i].id + "_cat_cell";


          if (hockey.categoryIsAbsolutable(tableMgr.categories[i])) {
            // Get the correct absoluted value for this stat
            newVal = tableMgr.getAbsolutedStat(hockey.getPlayerCategory(player, tableMgr.categories[i], tableMgr.categoryRanges.last), player.gamesPlayed, options.absolutism);
            // Update the "last" cell's html value
            $(this).children(htmlCatClass + ".last_stat").html(newVal);
            // Projected value
            newVal = hockey.getPlayerCategory(player, tableMgr.categories[i], tableMgr.categoryRanges.projected);
            // Set the projected value to also reflect the current absolutism setting
            newVal = options.absolutism == options.absolutismOptions.total || options.absolutism == options.absolutismOptions.perFullSeason ? newVal : Number.parseFloat(newVal / hockey.gamesPerSeason).toFixed(cat == hockey.categories.plusMinus ? 1 : 2);
            // Update the "projected" cell's html value
            $(this).children(htmlCatClass + ".projected_stat").html(newVal);
          }

          // Thin down the plusminus otherwise the display gets buggy
          //newVal = cat == tableMgr.categories.plusMinus ? Number.parseFloat(newVal).toFixed(1) : newVal;
/*
          // Last value
          newVal = tableMgr.getPlayerCategory(player, cat, tableMgr.ca
          tegoryRanges.last);
          // Set the value to reflect the current aboslutism setting, cutting at 2 decimals;
          newVal = options.absolutism == options.absolutismOptions.total ? newVal : Number.parseFloat(newVal / player.gamesPlayed).toFixed(cat == tableMgr.categories.plusMinus ? 1 : 2);*/

          ++i;
        }
        ++playerCount;
      });

  }

  this.loadPlayersFromHockeyReferenceCsv = function() {

    var loadedRow = "";
    var loadedValue = "";
    var separatorIndex = 0;

    var count = 0;
    var loadedPlayer = "";
    var currentPlayerId = -1;
    var duplicatePlayer = false;
    // Load players as rows (loop as long a "separation index" (;) is found)
    while (separatorIndex != -1) {
      // Find the end of the row ready to be loaded
      separatorIndex = playersCsv.indexOf(";");

      // Each row corresponds to a player's stats with a certain team for a certain season
      loadedRow = playersCsv.substring(0, separatorIndex);


      // Remove the players' row from the source data
      playersCsv = playersCsv.substring(separatorIndex + 1);

      // Output 30 rows for debug
      if (count > -1) {
        //console.log(loadedRow);
        loadedPlayer = tableMgr.extractValuesFromRow(loadedRow);


        duplicatePlayer = currentPlayerId == loadedPlayer.id;

        currentPlayerId = loadedPlayer.id;

        if (!duplicatePlayer) {
          tableMgr.buildPlayerRow(loadedPlayer);
        }
        ++count;
      }


    }
      tableMgr.updateOutput();
  };

  this.loadDbFromJson = function(json) {

    tableMgr.htmlOutput = "";

    var parsedPlayers = playersJson18;

    var totals = {
      goals: { last: 0, projected: 0 }, assists: { last: 0, projected: 0 }, points: { last: 0, projected: 0 }, powerPlayPoints: { last: 0, projected: 0 }, shots: { last: 0, projected: 0 }, hits: { last: 0, projected: 0 }, blockedShots: { last: 0, projected: 0 }
    };

    for (var i = 0; i < parsedPlayers.length; ++i) {
      // One-time only, assign depth ratings to players according to their TOI if it hasn't been done yet (otherwise waste of CPU)
      // parsedPlayers[i].depth.last = hockey.getDepthFromToi(parsedPlayers[i].timeOfIce.last, parsedPlayers[i].position);

      // Set the player's positions
      parsedPlayers[i][hockey.categories.positionsPlayed.str] = hockey.loadPositions(parsedPlayers[i][hockey.categories.position.str]);

      if (parsedPlayers[i].ppUnit === undefined) {
        parsedPlayers[i].ppUnit = { last: 0, projected: 0 };
      }


      tableMgr.loadPlayerTeamStats(parsedPlayers[i]);

      // Generate player scores after team stats are loaded for players
      scores.generatePlayerScores(parsedPlayers[i]);

        tableMgr.htmlOutput += tableMgr.buildPlayerRow(parsedPlayers[i]);
        // Push onto the loaded players
        tableMgr.loadedPlayers.push(parsedPlayers[i]);

      if (parsedPlayers[i].notes == "") {
        parsedPlayers[i].notes = (parsedPlayers[i].goals.last / parsedPlayers[i].shotsOnGoal.last * 100).toFixed(1);

      }


      tableMgr.compileTotals(parsedPlayers[i], totals);


    }

    console.log(totals);
    console.log(parsedPlayers);


        //  dbExporter.exportLoadedPlayers();
    filterMgr.refreshFilters();

  };

  this.loadPlayerTeamStats = function(player) {
    var teamData = schedule.getTeamData(player[hockey.categories.currentTeam.str]);

    if (teamData !== undefined) {
      player[hockey.categories.teamConflictRating.str] = teamData.averageConflictCount.toFixed(2);
      player[hockey.categories.teamOffDays.str] = teamData.rigidOffDays;
    }
  }

  this.compileTotals = function(player, totals) {
    totals.goals.last += tableMgr.getStat(parseInt(player.goals.last, 10));
    totals.goals.projected += tableMgr.getStat(parseInt(player.goals.projected, 10));
    totals.assists.last += tableMgr.getStat(parseInt(player.assists.last, 10));
    totals.assists.projected += tableMgr.getStat(parseInt(player.assists.projected, 10));
    totals.points.last += tableMgr.getStat(parseInt(player.points.last, 10));
    totals.points.projected += tableMgr.getStat(parseInt(player.points.projected, 10));
    totals.powerPlayPoints.last += tableMgr.getStat(parseInt(player.powerPlayPoints.last, 10));
    totals.powerPlayPoints.projected += tableMgr.getStat(parseInt(player.powerPlayPoints.projected, 10));
    totals.shots.last += tableMgr.getStat(parseInt(player.shotsOnGoal.last, 10));
    totals.shots.projected += tableMgr.getStat(parseInt(player.shotsOnGoal.projected, 10));
    totals.hits.last += tableMgr.getStat(parseInt(player.hits.last, 10));
    totals.hits.projected += tableMgr.getStat(parseInt(player.hits.projected, 10));
    totals.blockedShots.last += tableMgr.getStat(parseInt(player.blockedShots.last, 10));
    totals.blockedShots.projected += tableMgr.getStat(parseInt(player.blockedShots.projected, 10));
  }

  // Validates a value as a statistic
  this.getStat = function(value) {

  if (isNaN(value) || value == "" || value == undefined) { return 0; }
    else { return value; }
  }

  this.buildHeaders = function(tableName) {
    var topHeader = "<tr id=\"" + tableName + "_header_row\">";
    var subHeader = "<tr id=\"" + tableName + "_subheader_row\">";

    // Loop on every category displayed by the table
    for (var i = 0; i < tableMgr.categories.length; ++i) {
      var splitColumn = i >= tableMgr.splitColumnsStart && i < tableMgr.splitColumnsEnd;
      // Add the top header
      topHeader += "<th class=\"top_header " + tableMgr.categories[i].str + "_cell " + (i < tableMgr.splitColumnsStart ? "sort_header" : "") + "\"  id=\"player_" + tableMgr.categories[i].str + "_header_cell\" " + (splitColumn ? "colspan=\"2\"" : "") + ">" + tableMgr.categories[i].shorthand + "</th>";
      // Blank subheader for the player general information columns
      if (i == 0 && i < tableMgr.splitColumnsStart) {
        subHeader += "<th colspan=\"" + tableMgr.splitColumnsStart + "\"></th>";
      }

      // If a split column
      if (splitColumn) {
        // First column is last stat, second column is projected stat
        subHeader += "<th id=\"last_" + tableMgr.categories[i].str + "\" class=\"sort_header\">'18</th><th id=\"proj_" + tableMgr.categories[i].str + "\" class=\"sort_header\">'19</th>";
      }

      if (i == tableMgr.splitColumnsEnd) {
        subHeader += "<th colspan=\"" + Math.max(tableMgr.categories.length - tableMgr.splitColumnsEnd, 0) + "\"></th>";
      }

    }

    if (tableName == "players_Table") {
      // Add the action buttons columns
      topHeader += "<th class=\"action_header draft_cell\">Draft</th><th class=\"action_header commit_cell\">Commit</th>";
      subHeader += "<th></th><th id=\"commit_all_button\">ALL</th>";
    }
    return topHeader + subHeader;
  }

  this.initialize = function() {

    tableMgr.loadDbFromJson();

    $('#players_table thead').html(tableMgr.buildHeaders(tableMgr.statTable.attr('id')));

    // Add a click listener to the sorting cells
    $('thead .sort_header').on('click', tableMgr.handleSortClick);

  }

};

var posDepthFilter = new function() {

  // Number of filter values handled by this filter object
  this.valueCount = 6;

  // Maximal depth value allowed to be filtered for each position
  this.maxDepthValues = [
    // Forwards can be filtered as 1st, 2nd, 3rd or 4th line forwards
    // Defensemen can be filtered as 1st, 2nd or 3rd pair defensement
    // Goaltenders can be filtered as starting, backup or depth goaltenders
    3, 3, 3, 3, 3, 3
  ];

  this.currentValues = {
    // Positions are set to 0 (filtered out) or 1 (allowed)
    "positions": [1, 1, 1, 1, 0, 0],
    // Positional depths are set to 0 (allow all) by deafult
    "positionalDepth": [0, 0, 0, 0, 0, 0]//[1, 1, 0, 1, 0, 2]
  }

  this.filters = [];

  this.positionButtons = [
    $('#depth_filter_lw_header'),
    $('#depth_filter_c_header'),
    $('#depth_filter_rw_header'),
    $('#depth_filter_d_header'),
    $('#depth_filter_g_header'),
    $('#depth_filter_f_header')
  ];

  this.depthButtons = [
    $('#depth_filter_lw_value'),
    $('#depth_filter_c_value'),
    $('#depth_filter_rw_value'),
    $('#depth_filter_d_value'),
    $('#depth_filter_g_value'),
    $('#depth_filter_f_value')
  ];

  this.handlePositionClick = function(event) {
    var positionClicked = event.data.value;

    // Handle the "forwards" filter separately
    if (positionClicked == hockey.pos("fw")) {

      // If LWs, Cs and RWs are all filtered in already, newValue = 0 (filter out all forwards); otherwise, newValue = 1 (when not all forwards are filtered in, i.e. one or two of LW/C/RW)
      var newValue = posDepthFilter.currentValues.positions[0] == 1 || posDepthFilter.currentValues.positions[1] == 1 || posDepthFilter.currentValues.positions[2] == 1 ? 0 : 1;

      // Loop on the LW, C and RW positions
      for (var i = 0; i < 3; ++i) {
        // Set their value to 0 or 1, depending if forwardsAllIn
         posDepthFilter.setPositionValue(i, newValue);
         // Flick both filters on/off
         posDepthFilter.flickPositionFilter(i);
         posDepthFilter.flickDepthFilter(i);
      }

      // Update the forwards position/depth filter
      posDepthFilter.setPositionValue(hockey.pos("fw"), newValue);
      posDepthFilter.flickPositionFilter(hockey.pos("fw"));
      posDepthFilter.flickDepthFilter(hockey.pos("fw"));
    }
    // Exclude goaltenders
    else if (positionClicked == hockey.pos("g")) {}
    // Otherwise LW/C/RW/D
    else {

      // Update the filter value for the position
      posDepthFilter.updatePositionValue(positionClicked);
      // Flick the position filter on/off
      posDepthFilter.flickPositionFilter(positionClicked);

      // If new value is to filter out, gray out the depth filter as well
      posDepthFilter.flickDepthFilter(positionClicked);

      // For positions 0 (LW), 1 (C) and 2 (RW) check if the "fw" filter needs to be flicked on/off
      if (positionClicked < 3) {
        posDepthFilter.flickPositionFilter(hockey.pos("fw"));
        posDepthFilter.flickDepthFilter(hockey.pos("fw"));
      }
    }

  };

  this.setPositionValue = function(posIndex, newValue) {
    posDepthFilter.currentValues.positions[posIndex] = newValue;

    // Update the output filters; if position filter is set to 0, this position is filtered out and its value in the final output filter is -1; if position filter is set to 1, this position is allowed and the final output filter is set to the value of the positional depth filter, ranging from 0 to some integer
    posDepthFilter.filters[posIndex] = posDepthFilter.currentValues.positions[posIndex] == 0 ? -1 : posDepthFilter.currentValues.positionalDepth[posIndex];
  }

  this.updatePositionValue = function(posIndex) {
      // Position values can either be 0 or 1 - filtered out or allowed
      var currentValue = posDepthFilter.currentValues.positions[posIndex];

      // Switch from 0 <> 1
      posDepthFilter.setPositionValue(posIndex, currentValue == 0 ? 1 : 0);
  };

  this.flickPositionFilter = function(posIndex) {

      // Adjust the class of the clicked filter element as active or passive, depending on the position index
      $(posDepthFilter.positionButtons[posIndex]).attr("class", posDepthFilter.currentValues.positions[posIndex] == 0 ? "active_filter" : "passive_filter");
  };

  this.handleDepthClick = function(event) {
    var positionClicked = event.data.value;

    // All skaters
    if (positionClicked < hockey.pos("g")) {
      // Cycle the filtered depth for the position clicked
      posDepthFilter.setDepth(positionClicked, posDepthFilter.getNextDepth(positionClicked));
    }
    // Ignore goaltenders for now
    else if (positionClicked == hockey.pos("g")) {}
    // Forwards, presumably
    else {
      posDepthFilter.setForwardsDepth(posDepthFilter.getNextDepth(positionClicked))
    }
  };

  this.getNextDepth = function(positionIndex) {
    var currentDepth = posDepthFilter.currentValues.positionalDepth[positionIndex];
    var nextDepth = currentDepth + 1;

    // If the new depth overflows past the max value allowed for this position
    if (nextDepth > posDepthFilter.maxDepthValues[positionIndex]) {
      // Loop it back to 0
      nextDepth = 0;
    }

    return nextDepth;
  };

  this.setDepth = function(positionIndex, newValue) {
    var displayedValue = "";

    // Update the current positional depth value
    posDepthFilter.currentValues.positionalDepth[positionIndex] = newValue;

    // If depth value is 0 (no filter applied to this position)
    if (newValue == 0) {
      // Display ∀
      displayedValue = "&#8704";
    }
    // Otherwise if the new value is between 1 and the maximum depth value allowed for players of this position
    else if (newValue <= posDepthFilter.maxDepthValues[positionIndex] && newValue > 0) {
      // Simply display the new value
      displayedValue = newValue;
    }

    // Flick the filter button on or off
    posDepthFilter.flickDepthFilter(positionIndex);
    // Update the HTML content of the filter button
    posDepthFilter.depthButtons[positionIndex].html(displayedValue);
    // Update the output filter value; if position filter is set to 0, this position is filtered out and its value in the final output filter is -1; if position filter is set to 1, this position is allowed and the final output filter is set to the value of the positional depth filter, ranging from 0 to some integer
    posDepthFilter.filters[positionIndex] = posDepthFilter.currentValues.positions[positionIndex] == 0 ? -1 : newValue;
  };

  this.setForwardsDepth = function(depth) {
    // Set the LW depth accordingly...
    posDepthFilter.setDepth(0, depth);
    // C...
    posDepthFilter.setDepth(1, depth);
    // RW
    posDepthFilter.setDepth(2, depth);
    // Fwds
    posDepthFilter.setDepth(hockey.pos("fw"), depth);
  }

  this.flickDepthFilter = function(posIndex) {
      var curVal = posDepthFilter.currentValues.positionalDepth[posIndex];

      if (curVal == 0 && posDepthFilter.currentValues.positions[posIndex] != 0) {
        $(posDepthFilter.depthButtons[posIndex].attr("class", "passive_filter"));
      }
      else {
        $(posDepthFilter.depthButtons[posIndex].attr("class", "active_filter"));
      }
  }

  this.initialize = function() {

    var elementId = "";
    var value;
    var pos;
    var fwd = hockey.pos("fw");

    // Loop on the filter for each position - ignore goaltenders for now
    for (var i = 0; i < posDepthFilter.valueCount; ++i) {
        // If the positions is "Forwards", handle differently
        if (i == fwd) {
          value = fwd;
          pos = "fw";
        }
        else {
          value = i;
          pos = hockey.posArray[i];
        }
        // Add a click listener to the positional header cell
        posDepthFilter.positionButtons[i].on('click',
        {
          "value": value,
          "pos": pos,
          "type": "position_filter"
        }, posDepthFilter.handlePositionClick);

        // Add a click listener to the positional depth value cell
        posDepthFilter.depthButtons[i].on('click', {
          "value": i,
          "pos": hockey.posArray[i],
          "type": "positional_depth_filter"
        }, posDepthFilter.handleDepthClick);

        // Flick on the position filter
        posDepthFilter.flickPositionFilter(i);

        // Initialize the positional depth filter
        posDepthFilter.setDepth(i, posDepthFilter.currentValues.positionalDepth[i]);
    }
  }

};

var filterMgr = new function() {
  this.refreshBtn = $('#refresh_filters_button');

  this.posDepthFilter = posDepthFilter;

  this.debugActive = true;
  this.debug = function(out) {
    if (filterMgr.debugActive) {
      console.log(out);
    }
  };

  this.refreshFilters = function() {
    tableMgr.applyFilters({ posDepthFilter: filterMgr.posDepthFilter });
  }
  this.refreshBtn.on('click', this.refreshFilters);


  this.filterPosition = function(player) {
    var posIndex = hockey.pos(player.position);
    var filters = filterMgr.posDepthFilter.filters;
    var rawDepth = 0;

    for (var i = 0; i < player.positionsPlayed.length; ++i) {
      if (filters[player.positionsPlayed[i]] >= 0) {
        return filterMgr.filterDepth(player, player.positionsPlayed[i]);
      }
    }

      filterMgr.debug(player.name + " rejected due to POS");
      return false;
  };

  this.filterDepth = function(player, posIndex) {
    var filters = filterMgr.posDepthFilter.filters;

    // filter value == 0 implies all player are allowed
    if (filters[posIndex] == 0) {
      // Implicitly
      return true;
    }

    if (player.id == 622) {
      console.log('ok');
    }
    // otherwise some players are filtered out
    // Forwards are straightforward (!), depth is always the first character in the string
    else if (posIndex == hockey.positions.leftWing || posIndex == hockey.positions.rightWing || posIndex == hockey.positions.center) {
      // If the filtered value is at least equal to the player's depth, then this player is filtered in
      return filters[posIndex] >= parseInt(player.depth.last.substring(0, 1), 10);
    }
    // Defensemen
    else if (posIndex == hockey.positions.defenseman)
    {
      // 1st pairing defensemen
      if (player.depth.last == "1/2D") {
        return filters[posIndex] >= 1;
      // 2nd pairing defensemen
      } else if (player.depth.last == "3/4D") {
        return filters[posIndex] >= 2;
      // 3rd pairing defensemen
      } else if (player.depth.last == "5/6D") {
        return filters[posIndex] >= 3;
      } // 7th dmen are only allowed when no players of this position are filtered out
      else if (player.depth.last == "7D") {
        return false;
      }

      // Ignore goalies for now, should be like forwards anyway
      return false;
    }
  };
}


var options = new function() {
  this.absolutismSwitch = $('#absolutism_switch');
  this.absolutismOptions = { total: "TOTAL ", perGame: "  / GP", perFullSeason: "/ 82GP"};
  // Default absolutism setting
  this.absolutism = this.absolutismOptions.perFullSeason;

  this.handleAbsolutismSwitch = function(event) {
    // Switch between the option; if total -> per game, else if per game -> per full season, else total
    options.absolutism = options.absolutism == options.absolutismOptions.total ? options.absolutismOptions.perGame : options.absolutism == options.absolutismOptions.perGame ? options.absolutismOptions.perFullSeason : options.absolutismOptions.total;

    options.applyAbsolutism();
  }

  this.applyAbsolutism = function() {
    tableMgr.updateAbsolutism();

    // Update the HTML switch
    options.absolutismSwitch.html(options.absolutism);
  }

  this.initialize = function() {
    // Add click listeners to the switches
    options.absolutismSwitch.on('click', options.handleAbsolutismSwitch);

    options.applyAbsolutism();
  }
}
