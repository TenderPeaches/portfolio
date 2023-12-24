

var util = new function() {
  this.statValue = { ascending: "ascending", descending: "descending" };
}

// Hockey only contains information relevant to the game of hockey itself - the rules, the meta, the definitions, the categories, etc.
var hockey = new function() {

  // A category consists of an idenfiying string (used to access the category's value from a player by simply requesting player[category.str]), a unique ID integer, a shorthand used to identify the category where space is at a premium and a tresholds' array to set the color scale for this category in particular
  function Category(str, id, shorthand, tresholds, statValue) {
      this.str = str;
      this.id = id;
      this.shorthand = shorthand;
      this.tresholds = tresholds;
      // Needs to match hockey.statValue.ascending, this can change once hockey.categories is instanciated at runtime rather than in hockey declaration
      this.statValue = statValue === undefined || statValue == '' ? util.statValue.ascending : statValue;
  }

  function Team(locale, name, shorthand, darkColor, lightColor) {
    this.locale = locale;
    this.name = name;
    this.shorthand = shorthand;
    this.darkColor = darkColor;
    this.lightColor = lightColor;
  }// Set a player's numerical position identifier from his textual position stat
  this.pos = function(pos) {
    var p = pos.toLowerCase();

    // Primary left wing
    if (p == "lw" || p == "l") {
      return hockey.positions.leftWing;
    }
    // Primary center
    else if (p == "c") {
       return hockey.positions.center;
    }
    // Primary right wing
    else if (p == "rw" || p == "r") {
      return hockey.positions.rightWing;
    }
    // Primary defenseman
    else if (p == "d") {
      return hockey.positions.defenseman;
    }
    // Goaltender
    else if (p == "g") {
      return hockey.positions.goaltender;
    }
    // Forward
    else if (p == "f" || p == "fw" || p =="fwd") {
      return hockey.positions.leftWing;
    }
    return -1;
  }

  this.positions = {leftWing: 0, center: 1, rightWing: 2, defenseman: 3, goaltender: 4};
  this.posArray = [ "lw", "c", "rw", "d", "g" ];

  this.loadPositions = function(posString) {
    var positions = [];
    var strPositions = posString.split('/');
    for (var i = 0; i < strPositions.length; ++i) {
      positions[i] = hockey.pos(strPositions[i]);
    }

    return positions;
  }

  this.gamesPerSeason = 82;

  // List of categories that can be used with this tool
  this.categories = {
    none: new Category("none", -1, "--"),
    position: new Category("position", 0, "Pos"),
    name: new Category("name", 1, "Name"),
    id: new Category("id", 2, "ID"),
    currentTeam: new Category("currentTeam", 3, "Team"),
    gamesPlayed: new Category("gamesPlayed", 4, "GP"),
    salary: new Category("salary", 5, "$/Y"),
    age: new Category("age", 6, "Age"),
    notes: new Category("notes", 7, "Notes"),
    injuries: new Category("injuries", 8, "INJ"),
    linemates: new Category("linemates", 9, "Plays w/"),
    goals: new Category("goals", 10, "G", [15, 25, 32, 38, 43, 55]),
    evenStrengthGoals: new Category("evenStrengthGoals", 11, "ESG"),
    powerPlayGoals: new Category("powerPlayGoals", 12, "PPG"),
    shortHandedGoals: new Category("shortHandedGoals", 13, "SHG"),
    assists: new Category("assists", 14, "A", [24, 38, 48, 54, 58, 75]),
    evenStrengthAssists: new Category("evenStrengthAssists", 15, "ESA"),
    powerPlayAssists: new Category("powerPlayAssists", 16, "PPA"),
    shortHandedAssists: new Category("shortHandedAssists", 17, "SHA"),
    primaryAssists: new Category("primaryAssists", 18, "1yA"),
    secondaryAssists: new Category("secondaryAssists", 19, "2yA"),
    points: new Category("points", 20, "P", [40, 60, 70, 82, 90, 110]),
    evenStrengthPoints: new Category("evenStrengthPoints", 21, "ESP"),
    powerPlayPoints: new Category("powerPlayPoints", 22, "PPP", [9, 16, 28, 32, 34, 48]),
    shortHandedPoints: new Category("shortHandedPoints", 23, "SHP"),
    gameWinningGoals: new Category("gameWinningGoals", 30, "GWG"),
    shootoutGoals: new Category("shootoutGoals", 31, "S/O G"),
    plusMinus: new Category("plusMinus", 32, "+/-", [-8, 8, 18, 28, 32, 38]),
    penaltyMinutes: new Category("penaltyMinutes", 33, "PIM"),
    hits: new Category("hits", 34, "H", [108, 136, 164, 196, 220, 280]),
    blockedShots: new Category("blockedShots", 35, "BLK", [67, 105, 136, 169, 180, 220]),
    takeaways: new Category("takeaways", 36, "TKY"),
    turnovers: new Category("turnovers", 37, "TO"),
    shotsOnGoal: new Category("shotsOnGoal", 38, "SOG", [152, 212, 262, 285, 300, 360]),

    gamesStarted: new Category("gamesStarted", 50, "GS"),
    wins: new Category("wins", 51, "W"),
    losses: new Category("losses", 52, "L"),
    shutouts: new Category("shutouts", 53, "SO"),
    shotsAgainst: new Category("shotsAgainst", 54, "SA"),
    saves: new Category("saves", 55, "SV"),
    goalsAgainst: new Category("goalsAgainst", 57, "GA"),
    goalsAgainstAverage: new Category("goalsAgainstAverage", 58, "GAA"),
    shootoutSaves: new Category("shootoutSaves", 59, "S/O SV"),
    shotPercentage: new Category("shotPercentage", 60, "S%", [7, 10, 12, 15, 18, 40]),
    savePercentage: new Category("savePercentage", 61, "SV%"),
    depth: new Category("depth", 80, "Depth"),
    ppUnit: new Category("ppUnit", 81, "PP#"),
    shSquad: new Category("shSquad", 82, "SH#"),
    timeOfIce: new Category("timeOfIce", 83, "TOI"),
    powerPlayTimeOfIce: new Category("powerPlayTimeOfIce", 84, "PPTOI"),
    shortHandedTimeOfIce: new Category("shortHandedTimeOfIce", 85, "SHTOI"),
    fScore: new Category("fScore", 101, "F$",  [40, 55, 70, 80, 85, 100]),
    yScore: new Category("yScore", 102, "Y$", [40, 55, 70, 80, 85, 100]),
    yNoSchedScore: new Category("yNoSchedScore", 103, "Yns$", [40, 55, 70, 80, 85, 100]), ehjScore: new Category("ehjScore", 104, "EHJ$", [40, 55, 70, 80, 85, 102]),
    teamConflictRating: new Category("teamConflictRating", 150, "SoS", [9.3, 9, 8.7, 8.5, 8.2, 7], util.statValue.descending), teamOffDays: new Category("teamOffDays", 151, "GP/OffD", [30, 34, 38, 42, 46, 60]), positionsPlayed: new Category("positionsPlayed", 200, "Pos*")
  };

  this.teams = [new Team("Anaheim", "Ducks", "ANA", '#010101','#b09862'),
new Team("Arizona", "Coyotes", "ARI", "#8C2633", "#E2D6B5"), new Team("Boston", "Bruins", "BOS", "#000000", "#FFB81C"), new Team("Buffalo", "Sabres", "BUF", "#002654", "#FCB514"), new Team("Calgary", "Flames", "CGY", "#C8102E", "#F1BE48"), new Team("Carolina", "Hurricanes", "CAR", "#000000", "#CC0000"), new Team("Chicago", "Blackhawks", "CHI", "#CF0A2C", "#000000"), new Team("Colorado", "Avalanche", "COL", "#6F263D", "#236192"), new Team("Columbus", "Blue Jackets", "CBJ", "#002654", "#CE1126"), new Team("Dallas", "Stars", "DAL", "#006847", "#8F8F8C"), new Team("Detroit", "Red Wings", "DET", "#ce1126", "FFFFFF"), new Team("Edmonton", "Oilers", "EDM", "#041E42", "#FF4C00"), new Team("Florida", "Panthers", "FLA", "#c8102E", "#B9975B"), new Team("Los Angeles", "Kings", "LAK", "#111111", "#A2AAAD"), new Team("Minnesota", "Wild", "MIN", "#154734", "#A6192E"), new Team("Montreal", "Canadiens", "MTL", "#AF1E2D", "#192168"), new Team("Nashville", "Predators", "NSH", "#041E42", "#FFB81C"), new Team("New Jersey", "Devils", "NJD", "#CE1126", "#000000"), new Team("New York", "Islanders", "NYI", "#00539B", "#F47D30"), new Team("New York", "Rangers", "NYR", "#0038A8", "#CE1126"), new Team("Ottawa", "Senators", "OTT", "#000000", "#E31837"), new Team("Philadelphia", "Flyers", "PHI", "#000000", "#F74902"), new Team("Pittsburgh", "Penguins", "PIT", "#000000", "#FCB514"), new Team("St. Louis", "Blues", "STL", "#002787", "#FCB514"), new Team("San Jose", "Sharks", "SJS", "#000000", "#006D75"), new Team("Tampa Bay", "Lightning", "TBL", "#002868", "#FFFFFF"), new Team("Toronto", "Maple Leafs", "TOR", "#003E7E", "#FFFFFF"), new Team("Vancouver", "Canucks", "VAN", "#001F5B", "#99999A"), new Team("Vegas", "Golden Knights", "VGK", "#333F42", "#B4975A"), new Team("Washington", "Capitals", "WSH", "#041E42", "#c8102E"), new Team("Winnipeg", "Jets", "WPG", "#041E42", "#8E9090")] ;

  // If the parameter category is a computed score rather than a traditional statistic
  this.categoryIsScore = function(cat) {
    // Categories with ID of over 100 are scores, ie values computed from the stats
    return cat.id > 100;
  }

  // A static category is one that is not tracked throughout time and hence always has a single value; for example, a player's name, his position, current injuries, etc.
  this.categoryIsStatic = function(cat) {
    // For now all static categories are those with ID less than the goals' ID
    return cat.id < hockey.categories.id;
  }

  this.categoryIsAbsolutable = function(cat) {
    // Not a percentage
    return (cat.id < 60 || cat.id > 70) && (cat.id > 10) && (cat.id < 100);
  }

  // Time of Ice tresholds, set separately because they depend on the player's position
  this.toiTresholds = {   // Dmen tresholds : 16:30, 19:00, 21:15, 24:30, 25:45, 28:00
    defensemen: [990, 1140, 1275, 1470, 1545, 1680],
    centers: [900, 1020, 1095, 1140, 1260, 1380],
    // Wingers TOI tresholds : 14:00, 15:30, 16:45, 18:00, 19:15, 20:45
    wingers: [840, 930, 1005, 1080, 1155, 1245]
  };



  // Convert a player's time of ice from the "mm:ss" format to the number of seconds played as an integer number
  this.getToiInSeconds = function(toi) {
    var minutes = parseInt(toi.substring(0, toi.indexOf(":")), 10);

    return minutes * 60 + parseInt(toi.substring(toi.indexOf(":") + 1), 10);
  }
  // Get a quick estimate of a player's depth from his average time of ice and his position played
  this.getDepthFromToi = function(toi, pos) {
    // Total seconds played per game
    var totalSeconds = hockey.getToiInSeconds(toi);
    // If the player is a natural center
    if (pos == "C" || pos == "C/RW" || pos == "C/LW" || pos == "C/LW/RW") {
      // Top 31 centers by TOI play over 18:30/GP
      if (totalSeconds >= hockey.getToiInSeconds("18:30")) {
        return "1C";
      }
      // Top 62 centers by TOI play over 17:15/GP
      else if (totalSeconds >= hockey.getToiInSeconds("17:15")) {
        return "2C";
      }
      // A center who plays at least 1/4th of the game is considered a 3C
      else if (totalSeconds >= hockey.getToiInSeconds("15:00")) {
        return "3C";
      }
      // Otherwise, assumed to be a depth center
      else {
        return "4C";
      }
    }
    // Else if the player is a natural winger
    else if (pos == "LW" || pos == "RW" || pos == "LW/RW" || pos == "LW/C" || pos == "RW/C" || pos == "W" || pos == "F") {
      // Top 62 wingers by TOI play over 16:30/GP
      if (totalSeconds >= hockey.getToiInSeconds("16:30")) {
        return "1W";
      }
      // Top 124 wingers by TOI play over 14:05/GP
      else if (totalSeconds >= hockey.getToiInSeconds("14:05")) {
        return "2W";
      }
      // Top 186 wingers by TOI play over 12:00/GP
      else if (totalSeconds >= hockey.getToiInSeconds("12:00")) {
        return "3W";
      }
      // Otherwise, assumed to be a depth winger
      else {
        return "4W";
      }
    }
      // Else if the player is a natural defenseman
    else if (pos == "D" || pos == "D/RW" || pos == "D/LW") {
      // Top 62 defensemen by TOI play over 21:30/GP
      if (totalSeconds >= hockey.getToiInSeconds("21:30")) {
        return "1/2D";
      }
      // Top 124 defensemen by TOI play over 19:00/GP
      else if (totalSeconds >= hockey.getToiInSeconds("19:00")) {
        return "3/4D";
      }
      // Top 186 defensemen by TOI play over 16:30/GP
      else if (totalSeconds >= hockey.getToiInSeconds("16:30")) {
        return "5/6D";
      }
      // Otherwise, assumed to be a depth defenseman
      else {
        return "7D";
      }
    }
  };


  // CategoryString has the match the category property named defined in hockey.categories
  this.getPlayerMostRecentCategory = function(player, categoryString) {
    return parseInt(player[categoryString].projected === undefined || player[categoryString].projected == "" ? tableMgr.getAbsolutedStat(player[categoryString].last, player.gamesPlayed, player.gamesPlayed > 10 ? options.absolutismOptions.perFullSeason : options.absolutismOptions.total) : player[categoryString].projected, 10);
  }


  this.getPlayerCategory = function(player, category, range) {
    // For a static category, simply return the player's value for this category; Returns undefined it not yet set
    if (hockey.categoryIsStatic(category)) {
      return parseInt(player[category.str]);
    }
    // Otherwise
    else {
      // Return the value for the category's appropriate range
      return parseInt(player[category.str][range]);
    }
  }

  this.getPlayerStat = function(stat) {
    if (stat.projected === undefined || stat.projected == "") {
      return tableMgr.stat.last;
    }
    else {
      return stat.projected;
    }
  }

  this.estimateProjectedStat = function(player, lastStat) {
    return (lastStat / player.gamesPlayed * hockey.gamesPerSeason).toFixed(0);
  }

  this.promptNewValue = function(event) {
    var playerId = event.target.parentElement.id.substring(7);

    console.log(event.target);
    var currentValue = event.target.innerHTML;

    $(event.target).append("<input type=\"text\">" + currentValue + "</input>");

    $(event.target).children(".stat_input_confirmation").on('click', function(event) {
      console.log('ding the dongs');
    })
  };

  this.commitPlayerRow = function(event) {
    var committedRow = event.target.parentElement;
    // Player ID of the row that is committed
    var playerId = clickedRow.id.substring(7);

    // Projected values input by the user that are to be committed to the user's JSON file
    var projectedValues = {
      depth: committedRow.children('.depth_cell.projected_stat').val()
    };

    console.log(projectedValues);
  }
};

var colorScale = new function() {
    // Max tint
    this.defaultMaxTint = 200;

    this.getFScoreColor = function(fScore) {
      var red = 0;
      var green = 0;
      var blue = 0;

      // pentile = {1,5}, where 5 = fScore > 80, 4 = fScore > 60, etc
      var pentileRange = 100 / 5;
      // pentile as from percentile, here the color scale is divided in 5 parts : red to yellow, where RGB:255,0->255,0; yellow to green RGB:255->0,255,0; green to cyan RGB:0,255,0->255; cyan to blue RGB:0,255->0,255 and blue to magenta RGB:0->255,0,255
      var pentile = Math.floor(fScore / pentileRange);

      // Max tint means how high the tint for each color goes; lower values means darker output color
      var maxTint = 200;

      // Grade gives the color corresponding to how far the fScore scales into the pentile
      var grade = fScore % pentileRange;
      var ascendingGrade = Math.floor(maxTint * grade / pentileRange);
      var descendingGrade = Math.floor(maxTint * (pentileRange - grade) / pentileRange);

      red = pentile == 0 || pentile == 5 ? maxTint : pentile == 1 ? descendingGrade : pentile == 4 ? ascendingGrade : 0;

      green = pentile == 0 ? ascendingGrade : pentile < 3 ? maxTint : pentile == 3 ? descendingGrade : 0;

      blue = pentile < 2 ? 0 : pentile == 2 ? ascendingGrade : maxTint;

      return "#" + ("00" + red.toString(16)).substr(-2) + ("00" + green.toString(16)).substr(-2) + ("00" + blue.toString(16)).substr(-2);

    }

    this.getCategoryColor = function(category, value) {
      var red = 0;
      var green = 0;
      var blue = 0;

      // Max tint means how high the tint for each color goes; lower values means darker output color
      var maxTint = 200;

      var pentile = 0;

      var grade = 0;
      var ascendingGrade = 0;
      var descendingGrade = 0;

      if (category.tresholds !== undefined) {

        for (var i = 0; i < category.tresholds.length; ++i) {

          pentile = i;
          if (category.tresholds[i] > value && category.statValue == util.statValue.ascending || category.tresholds[i] < value && category.statValue == util.statValue.descending) {
            break;
          }
        }


        if (pentile < category.tresholds.length) {
          // If pentile is 0, for ascending stats lower bound is set to 0, for descending stats lower bound is set to 0th pentile's value + difference bettwen 1st and 0th' pentile
          var lowerBound = pentile == 0 ? category.statValue == util.statValue.ascending ? category == hockey.categories.teamOffDays ? 20 : 0 : category.tresholds[0] + (category.tresholds[1] - category.tresholds[0]) : category.tresholds[pentile - 1];
          var upperBound = category.tresholds[pentile];
        }
        else {
          var lowerBound = category.tresholds[pentile];
          var upperBound = category.tresholds[pentile] + (category.tresholds[pentile] - category.tresholds[pentile - 1]) * 3;
        }

        var tresholdRange = Math.abs(upperBound - lowerBound);

        if (category.statValue == util.statValue.ascending) {

          grade = lowerBound == 0 ? value : value % lowerBound;
        }
        else {
          grade = Math.abs(lowerBound - value) / tresholdRange;
        }

        ascendingGrade = Math.floor(maxTint * grade / tresholdRange);
        descendingGrade = Math.floor(maxTint * (tresholdRange - grade) / tresholdRange);

      }
      else {
        var pentileRange = 20;
        grade = value % pentileRange;
        ascendingGrade = Math.floor(maxTint * grade / pentileRange);
        descendingGrade = Math.floor(maxTint * (pentileRange - grade) / pentileRange);

        }
      return colorScale.getColor(pentile, maxTint, grade, ascendingGrade, descendingGrade, category.statValue);
;
    }

    this.getColor = function(pentile, maxTint, grade, ascendingGrade, descendingGrade) {

        red = pentile == 0 ? maxTint : pentile == 1 ? descendingGrade : pentile == 4 ? Math.floor(ascendingGrade / 2) : pentile == 5 ? Math.floor((ascendingGrade + maxTint) / 2) : 0;

        green = pentile == 0 ? ascendingGrade : pentile < 3 ? maxTint : pentile == 3 ? Math.floor((descendingGrade + maxTint) / 2) : pentile == 4 ? Math.floor(descendingGrade / 2) : 0;

        blue = pentile < 2 ? 0 : pentile == 2 ? ascendingGrade : pentile < 5 ? maxTint : Math.floor((descendingGrade + maxTint) / 2);

        return "#" + ("00" + red.toString(16)).substr(-2) + ("00" + green.toString(16)).substr(-2) + ("00" + blue.toString(16)).substr(-2);
    }

    this.getTimeOfIceColor = function(value, position) {
      var secondsPerGame = parseInt(value.substring(0,2), 10) * 60 + parseInt(value.substring(3), 10);

      var toiTresholdsArray = position == 'D' ? hockey.toiTresholds["defensemen"] : position == 'C' ? hockey.toiTresholds["centers"] : hockey.toiTresholds["wingers"];

      var pentile = 0;

      for (var i = 0; i < toiTresholdsArray.length; ++i) {
        pentile = i;

        if (toiTresholdsArray[i] > secondsPerGame) {
          break;
        }
      }

      if (pentile < toiTresholdsArray.length) {
        var lowerBound = pentile == 0 ? 0 : toiTresholdsArray[pentile - 1];
        var upperBound = toiTresholdsArray[pentile];
      }
      else {
        var lowerBound = toiTresholdsArray[pentile];
        var upperBound = toiTresholdsArray[pentile] + (toiTresholdsArray[pentile] - toiTresholdsArray[pentile - 1]);
      }

      var tresholdRange = upperBound - lowerBound;

      var grade = lowerBound == 0 ? secondsPerGame : secondsPerGame % lowerBound;
      var ascendingGrade = Math.floor(colorScale.defaultMaxTint * grade / tresholdRange);
      var descendingGrade = Math.floor(colorScale.defaultMaxTint * (tresholdRange - grade) / tresholdRange);

      return colorScale.getColor(pentile, colorScale.defaultMaxTint, grade, ascendingGrade, descendingGrade);
    }

    this.shadeColor = function(color, percent) {
      var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
      return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }
}


var scores = new function() {

  this.generatePlayerScores = function(player) {

    player[hockey.categories.yScore.str] = scores.getScore(player, hockey.categories.yScore);

    player[hockey.categories.yNoSchedScore.str] = scores.getScore(player, hockey.categories.yNoSchedScore);

    player[hockey.categories.ehjScore.str] = scores.getScore(player, hockey.categories.ehjScore);
  }

  this.getScore = function(player, scoreCategory) {
    if (!hockey.categoryIsScore(scoreCategory)) {
      return -1;
    }

    var projectedScore = 0;
    var lastScore = 0;

    switch(scoreCategory) {
      case hockey.categories.fScore:
        return scores.getFScore(player, tableMgr.categoryRanges.all);
        break;
      case hockey.categories.yScore:
        return scores.getYScore(player, tableMgr.categoryRanges.all);
        break;
      case hockey.categories.yNoSchedScore:
        return scores.getYNoSchedScore(player, tableMgr.categoryRanges.all);
      case hockey.categories.ehjScore:
        return scores.getEhjScore(player, tableMgr.categoryRanges.all);
        break;
      default:
        return -1;
    }
  }

  this.getFScore = function(player, range) {
    // If scores for all ranges need to be returned
    if (range == tableMgr.categoryRanges.all) {
      return { "projected": scores.getFScore(player, tableMgr.categoryRanges.projected), "last": scores.getFScore(player, tableMgr.categoryRanges.last) };
    }
    // Otherwise compute the score for the appropriate range
    else {
      // Value of a position
      //var posRating =

    }
  }

  this.adjustScoreForPosition = function(player, score) {
    var positionsPlayed = player[hockey.categories.positionsPlayed.str].length;
    var tmpScore = score;

    if (positionsPlayed > 1) {
      for (var i = 0; i < positionsPlayed; ++i) {
        if (player[hockey.categories.positionsPlayed.str][i] == hockey.positions.leftWing || player[hockey.categories.positionsPlayed.str][i] == hockey.positions.rightWing) {
          tmpScore *= 1.06;
        }
        else if (player[hockey.categories.positionsPlayed.str][i] == hockey.positions.center) {
          tmpScore *= 1.03;
        }
        else if (player[hockey.categories.positionsPlayed.str][i] == hockey.positions.defensemen) {
          tmpScore *= 1.09;
        }
      }

      return tmpScore;
    }
    else {
      if (player[hockey.categories.positionsPlayed.str][0] == hockey.positions.center) {
        return score * 0.95;
      }
      else if (player[hockey.categories.positionsPlayed.str][0] == hockey.positions.defenseman) {
        return score * 1.1;
      }

      return score;
    }
  }

  // Y(ahoo) Score is meant to value players according to the Yahoo standard statistics (G, A, +/-, PPP, SOG, HIT)
  this.getYScore = function(player, range) {
    if (range == tableMgr.categoryRanges.all) {
      return { "projected": scores.getYScore(player, tableMgr.categoryRanges.projected), "last": scores.getYScore(player, tableMgr.categoryRanges.last)}
    }
    else {
      var yScore = 0;

      // Shots on goal
      yScore = hockey.getPlayerCategory(player, hockey.categories.shotsOnGoal, range) + hockey.getPlayerCategory(player, hockey.categories.goals, range) * 0.5 + hockey.getPlayerCategory(player, hockey.categories.assists, range) * 3 + hockey.getPlayerCategory(player, hockey.categories.hits, range) / 8;


      // Adjust for strengh of schedule & off days
      // yScore *= 1 - (player[hockey.categories.teamConflictRating.str] - 8.7) / 60;


      yScore *= 1 + (player[hockey.categories.teamOffDays.str] - 22) / 180;
      /*
      if (player.id == 622 || player.id == 538 || player.id == 108 || player.id == 288)
      {
        console.log(player.name);
        console.log("SOG " + hockey.getPlayerCategory(player, hockey.categories.shotsOnGoal, range));
        console.log("G / 2 " + hockey.getPlayerCategory(player, hockey.categories.goals, range) * 0.5);
        console.log("A * 2.5 " + hockey.getPlayerCategory(player, hockey.categories.assists, range) * 2.5);
        console.log("H / 6 " + hockey.getPlayerCategory(player, hockey.categories.hits, range) / 6);

        console.log(yScore);

      }*/
      var ppUnit = hockey.getPlayerCategory(player, hockey.categories.ppUnit, range);
      yScore *= 1 + (ppUnit == 0 ? 0 : ppUnit == 1 ? 0.4 : ppUnit == 2 ? 0.15 : ppUnit == 3 ? 0.52 : 0);

      yScore = scores.adjustScoreForPosition(player, yScore);

      return isNaN(yScore) ? 0 : (yScore / 8).toFixed(0);
    }
  };

  this.getYNoSchedScore = function(player, range) {
    if (range == tableMgr.categoryRanges.last) {
      return scores.getYScore(player, range);
    }
    else if (range == tableMgr.categoryRanges.all) {
      return { "projected": scores.getYNoSchedScore(player, tableMgr.categoryRanges.projected), "last": scores.getYNoSchedScore(player, tableMgr.categoryRanges.last)};
    }
    else {

        var yScore = 0;

        // Shots on goal
        yScore = hockey.getPlayerCategory(player, hockey.categories.shotsOnGoal, range) + hockey.getPlayerCategory(player, hockey.categories.goals, range) * 0.5 + hockey.getPlayerCategory(player, hockey.categories.assists, range) * 2.5 + hockey.getPlayerCategory(player, hockey.categories.hits, range) / 8;

        var ppUnit = hockey.getPlayerCategory(player, hockey.categories.ppUnit, range);
        yScore *= 1 + (ppUnit == 0 ? 0 : ppUnit == 1 ? 0.4 : ppUnit == 2 ? 0.15 : ppUnit == 3 ? 0.52 : 0);

        // Buff value for defensemen
        yScore = scores.adjustScoreForPosition(player, yScore);

        return isNaN(yScore) ? 0 : (yScore / 8).toFixed(0);
    }
  }

  // Raw overall score
  this.getROScore = function(player, range) {

      var stdScore = 0;
      stdScore += hockey.getPlayerCategory(player, hockey.categories.goals, range) * 13;

      stdScore += hockey.getPlayerCategory(player, hockey.categories.assists, range) * 8;

      stdScore += hockey.getPlayerCategory(player, hockey.categories.points, range) * 5

      stdScore += hockey.getPlayerCategory(player, hockey.categories.powerPlayPoints, range) * 20;

      stdScore += parseInt((hockey.getPlayerCategory(player, hockey.categories.shotsOnGoal, range) * 1.25 ).toFixed(1), 10);

      stdScore += parseInt((hockey.getPlayerCategory(player, hockey.categories.hits, range) * 2).toFixed(1), 10);

      stdScore += parseInt((hockey.getPlayerCategory(player, hockey.categories.blockedShots, range) * 2.75), 10);

      return (stdScore / 30).toFixed(0);
  }

  // EHJ League score, yahoo STD + PTS + BS
  this.getEhjScore = function(player, range) {
    if (range == tableMgr.categoryRanges.all) {
      return { "projected": scores.getEhjScore(player, tableMgr.categoryRanges.projected), "last": scores.getEhjScore(player, tableMgr.categoryRanges.last)};
    }
    else {
      var ehjScore = 0;
      ehjScore = hockey.getPlayerCategory(player, hockey.categories.shotsOnGoal, range) * 1.1;

      ehjScore += hockey.getPlayerCategory(player, hockey.categories.goals, range) * 0.8;

      ehjScore += hockey.getPlayerCategory(player, hockey.categories.assists, range) * 3.4;

      ehjScore += hockey.getPlayerCategory(player, hockey.categories.hits, range) / 8;

      ehjScore += hockey.getPlayerCategory(player, hockey.categories.blockedShots, range) / 4;

      ehjScore *= 1 + (player[hockey.categories.teamOffDays.str] - 22) / 360;

      var ppUnit = hockey.getPlayerCategory(player, hockey.categories.ppUnit, range);
      ehjScore *= 1 + (ppUnit == 0 ? 0 : ppUnit == 1 ? 0.4 : ppUnit == 2 ? 0.15 : ppUnit == 3 ? 0.52 : 0);

      // Buff value for defensemen
      ehjScore = scores.adjustScoreForPosition(player, ehjScore);

      return isNaN(ehjScore) ? 0 : (ehjScore / 9).toFixed(0);
    }
  }

}
