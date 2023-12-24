var scheduleFromCsvToJson = new function() {

  this.convert = function(source) {
    var loadedRow = "";
    var loadedValue = "";
    var separatorIndex = 0;
    var rowSeparator = ",,,,,";

    var count = 0;
    var loadedMatchup = "";
    var matchupId = -1;
    var duplicateMatchup = false;

    var matchups = [];

    // Load Matchups as rows (loop as long a "separation index" (;) is found)
    while (separatorIndex != -1) {
      // Find the end of the row ready to be loaded
      separatorIndex = source.indexOf(rowSeparator);

      // Each row corresponds to a Matchup's stats with a certain team for a certain season
      loadedRow = source.substring(0, separatorIndex);


      // Remove the Matchups' row from the source data
      source = source.substring(separatorIndex + rowSeparator.length);

      var values = loadedRow.split(",");

      var loadedMatchup = {
        date: values[0],
        awayTeam: values[1],
        homeTeam: values[3],
      };

      matchups.push(loadedMatchup);
      ++count;
    }

    console.log(JSON.stringify(matchups));
  }
}

scheduleFromCsvToJson.convert(nhlSchedule18);
