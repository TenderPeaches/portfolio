$(function() {
  draft.initialize();
})

var draft = new function() {
  this.team = [];

  this.draftedTable = $('#drafted_team_table');
  this.draftedPlayersList = $('#drafted_team_table tbody');


  this.draftPlayer = function(player) {
    draft.team.push(player);

    draft.draftedPlayersList.append(tableMgr.buildPlayerRow(player));

    var teamOutput = "{ id: , players: [";

    for (var i = 0; i < draft.team.length; ++i) {
      teamOutput += (i > 0 ? ", " : "") + draft.team[i].id;
    }

    teamOutput += "], name: }";

    console.log(teamOutput);
  }


  this.initialize = function() {
    draft.draftedTable.append(tableMgr.buildHeaders("drafted_team_table"));

    //var dbOpen = idb.open('test', 1);
  }
}
