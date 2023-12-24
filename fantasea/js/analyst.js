$(function() {
  schedule.analyze(nhlSchedule18json);
});

var schedule = new function() {
  this.teams = hockey.teams;

  this.teamTable = $('#team_table');

  //this.conflictsTable = [];

  $('th').on('click', function(event) {
      schedule.teamTable.sort()
  })

  this.getTeamData = function(shorthand) {
    try {
      return schedule.teams[schedule.teams.findIndex(function (e) { return e.shorthand == shorthand })].data;
    }
    catch (e) {
      return undefined;
    }
  }

  this.analyze = function(scheduleJsonString) {
    try {
      var matchups = JSON.parse(scheduleJsonString);
      var dailyMatchups = [];
      var currentDate = matchups[0].date;


      for (var i = 0; i < schedule.teams.length; ++i) {
        schedule.teams[i].data = { rigidOffDays: 0, averageConflictCount: 0.0 };
      }

      for (var i = 0; i < matchups.length; ++i) {

          if (currentDate != matchups[i].date) {

            schedule.analyzeDate(dailyMatchups);

            dailyMatchups = [];
            currentDate = matchups[i].date;
          }

          dailyMatchups.push(matchups[i]);
        }

        schedule.teamTable.children('tbody').empty();

        if (schedule.teamTable !== undefined) {
          schedule.updateOutput();
        }
    }
    catch (e) {
      console.log("Error parsing schedule JSON " + e);
    }
  }

  this.updateOutput = function() {
    var sortBy = "rigidOffDays";


    schedule.teams.sort(function(a, b) {
      return a.data[sortBy] < b.data[sortBy];
    })

      for (var i = 0; i < schedule.teams.length; ++i) {

        try {

          schedule.teamTable.children('tbody').append('<tr class="team_row" id="row_' + i + '"><td>' + schedule.teams[i].shorthand + '</td><td>' + schedule.teams[i].data.rigidOffDays + '</td><td>' + schedule.teams[i].data.averageConflictCount.toFixed(2) + '</td></tr>');
        }
        catch (e) {

        }



      }
  }

  this.analyzeDate = function(matchups) {
    var currentTeamIndex = -1;

    for (var j = 0; j < matchups.length; ++j) {
      schedule.analyzeDateForTeam(matchups, schedule.getTeamIndexFromString(matchups[j].awayTeam));

      schedule.analyzeDateForTeam(matchups, schedule.getTeamIndexFromString(matchups[j].homeTeam));
    }

  }

  this.analyzeDateForTeam = function(matchups, teamIndex) {
    var gameCount = matchups.length;
    var date = new Date(matchups[0].date) || "";

    schedule.teams[teamIndex].data.averageConflictCount += gameCount / hockey.gamesPerSeason;

    // Off days are all odd days: Monday(1), Wednesday (3), Friday (5) plus Sunday (0)
    if (date.getDay() % 2 == 0 || date.getDay() == 0) {
      ++schedule.teams[teamIndex].data.rigidOffDays;
    }
  }

  this.getTeamIndexFromString = function(string) {
    var teamIndex = schedule.teams.findIndex(function(e) {
      return string.indexOf(e.name) > -1;
    });

    return teamIndex;
  }
}
