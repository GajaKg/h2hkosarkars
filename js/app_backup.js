function getServiceData(method, url, bool){

    try{
        var result, req;
        /*
        if(window.XMLHttpRequest()){
            req = new XMLHttpRequest();
        } else {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        */

        req = new XMLHttpRequest();

        req.onreadystatechange = function(){
            if(req.readyState == 4 && req.status == 200){
                result = JSON.parse(req.response);
            }
        }

        req.open(method, url, bool);
        req.send();
        return result;
    }
    catch(error){
        return error;
    }
}

let tournament = "Chalenger";
let league1 = "Seria A/1";
let league2 = "Seria A/2";
let currentWeek = 1;
let sortedLeague = [];
let leaguesHTML = {
    "Seria A/1": "SeriaA1",
    "Seria A/2": "SeriaA2"
};

let league1Teams = {
    "User1": { team: "Tim1", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User2": { team: "Tim2", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User3": { team: "Tim3", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User4": { team: "Tim4", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User5": { team: "Tim5", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User6": { team: "Tim6", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User7": { team: "Tim7", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User8": { team: "Tim8", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User9": { team: "Tim9", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "User10": { team: "Tim10", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 }
};
let league2Teams = {
    "Surda": { team: "KK Skugric", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "AugriAugri": { team: "Pokvareni Osmijeh", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "Lucky": { team: "Boca Juniors", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "Gira S": { team: "Gira S", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "Korto Malteze": { team: "Korto Malteze", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "Antonie": { team: "Madness", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "Obilic": { team: "KK Sipurske Livade", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "DD": { team: "K42", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "Skeva": { team: "Davorike Dajke", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 },
    "Djordjino": { team: "Djordjino", indUp: 0, indDown: 0, indDiff: 0, pts: 0, w: 0,  l: 0, d: 0 }
};

let league1Table = [];
let league2Table = [];

// let matchups = getServiceData("GET", "http://localhost/h2h/js/backup.json", false);
let matchups = getServiceData("GET", "https://api.myjson.com/bins/1cyih2", false);

$(document).ready(function () {

    renderFixturesTableByLeague("Chalenger", "Seria A/1");

    renderWeeksTableByLeague("Chalenger", "Seria A/1");
    renderWeeksTableByLeague("Chalenger", "Seria A/2");

    $("#SeriaA1-week-"+currentWeek).show();
    $("#SeriaA2-week-"+currentWeek).show();

    $("#SeriaA1-round-holder .round-item").on("click", function () {
        showSelectedWeekByLeague("SeriaA1", this)
    });
    $("#SeriaA2-round-holder .round-item").on("click", function () {
        showSelectedWeekByLeague("SeriaA2", this)
    });

    for(let username in league1Teams){
        createAndSortUserScoresByLeagueAndUsername(tournament, league1, username);
    }
    sortTable();

});

function renderWeeksTableByLeague(tournament, league){
    let leagueFixtures = matchups[tournament][league];
    let leagueID = leaguesHTML[league];
    let weekID = 0;
    for (let week in leagueFixtures){
        weekID++;
        let currentClass = (weekID == currentWeek) ? "round-active" : "";
        $("#"+leagueID+"-round-holder").append('<div class="round-item '+currentClass+'" data-round="'+weekID+'">'+weekID+'</div>');
    }


}

function showSelectedWeekByLeague(league, week) {//SeriaA1-week-1
    $("#"+league+"-round-holder .round-item").removeClass("round-active");
    let selectedWeek = $(week);
    let weekNumber = selectedWeek.data("round");
    selectedWeek.addClass("round-active");
    $("."+league+"-weeks").hide();
    $("#"+league+"-week-"+weekNumber).fadeIn("slow");
}

function renderFixturesTableByLeague(tournament, league){
    let leagueID = leaguesHTML[league];
    let leagueFixtures = matchups[tournament][league];
    let weekID = 0;

    for (let week in leagueFixtures){
        weekID++;
        let leagueWeekFixtures = leagueFixtures[week];

        let output = "";
        output += '<tbody id="'+leagueID+'-week-'+weekID+'" class="'+leagueID+'-weeks">';

        for (let fixture in leagueWeekFixtures){
            let matchup = leagueWeekFixtures[fixture];

            output += '<tr>';
            output += '<td>';
            output += '<figure><img src="images/'+matchup["teamLocal"]["username"]+'.jpg" alt=""></figure>';
            output += '<div class="player-stats-text">';
            output += '<h6>'+matchup["teamLocal"]["teamName"]+'</h6>';
            output += '<span>'+matchup["teamLocal"]["username"]+'</span>';
            output += '</div>';
            output += '</td>';
            output += '<td class="round-index">'+matchup["teamLocal"]["indexMade"]+'</td>';
            output += '<td><span>vs</span></td>';
            output += '<td class="round-index">'+matchup["teamVisitor"]["indexMade"]+'</td>';
            output += '<td>';
            output += '<figure><img src="images/'+matchup["teamVisitor"]["username"]+'.jpg" alt=""></figure>';
            output += '<div class="player-stats-text">';
            output += '<h6>'+matchup["teamVisitor"]["teamName"]+'</h6>';
            output += '<span>'+matchup["teamVisitor"]["username"]+'</span>';
            output += '</div>';
            output += '</td>';
            output += '</tr>';

        }
        output += '</tbody>';

        $("#"+leagueID+"-fixtures").append(output);

    }

}

function createAndSortUserScoresByLeagueAndUsername(tournament, league, username){
    let leagueWeeks = matchups[tournament][league];
    let weekID = 1;
    for (let week in leagueWeeks){
        console.log(".");
        let weekFixtures = leagueWeeks[week];

        for (let fixture in weekFixtures){
            let matchup = weekFixtures[fixture];

            if (matchup["teamLocal"]["username"] == username){
                let pts = 0, w = 0, l = 0, d = 0;
                let indUp = matchup["teamLocal"]["indexMade"];
                let indDown = matchup["teamVisitor"]["indexMade"];
                let indDiff = indUp - indDown;

                if (indDiff > 0){
                    pts = 2;
                    w = 1;
                }
                if (indDiff == 0){
                    pts = 1;
                    d = 1;
                }
                if (indDiff < 0) {
                    l = 1;
                }
                league1Teams[username]["w"] += w;
                league1Teams[username]["l"] += l;
                league1Teams[username]["d"] += d;
                league1Teams[username]["indUp"] += indUp;
                league1Teams[username]["indDown"] += indDown;
                league1Teams[username]["indDiff"] += indDiff;
                league1Teams[username]["pts"] += pts;
                // break;
            }
            if (matchup["teamVisitor"]["username"] == username){
                let pts = 0, w = 0, l = 0, d = 0;
                let indUp = matchup["teamVisitor"]["indexMade"];
                let indDown = matchup["teamLocal"]["indexMade"];
                let indDiff = indUp - indDown;

                if (indDiff > 0){
                    pts = 2;
                    w = 1;
                }
                if (indDiff == 0){
                    pts = 1;
                    d = 1;
                }
                if (indDiff < 0) {
                    l = 1;
                }
                league1Teams[username]["w"] += w;
                league1Teams[username]["l"] += l;
                league1Teams[username]["d"] += d;
                league1Teams[username]["indUp"] += indUp;
                league1Teams[username]["indDown"] += indDown;
                league1Teams[username]["indDiff"] += indDiff;
                league1Teams[username]["pts"] += pts;
                // break;
            }

        }

        return weekID == currentWeek;
    }

}


function sortTable(){
    // let sortedLeague = [];
    console.log(league1Teams);
    for (let username in league1Teams){
        let teamData = league1Teams[username];
        sortedLeague.push(
            {
                "username": username,
                "team": teamData.team,
                "indDiff": teamData.indDiff,
                "indUp": teamData.indUp,
                "indDown": teamData.indDown,
                "pts": teamData.pts,
                "w": teamData.w,
                "l": teamData.w,
                "d": teamData.w
            }
        )
    }
    sortedLeague.sort(function(team1, team2){
        if (team1.pts < team2.pts) return 1;
        if (team1.pts > team2.pts) return -1;
        if (team1.indDiff < team2.indDiff) return 1;
        if (team1.indDiff > team2.indDiff) return -1;
        if (team1.indUp < team2.indUp) return 1;
        if (team1.indUp > team2.indUp) return -1;
        if (team1.indDown < team2.indDown) return 1;
        if (team1.indDown > team2.indDown) return -1;
    });console.log(sortedLeague);
    renderLeagueTable(tournament, sortedLeague, "SeriaA1");
}

function renderLeagueTable(tournament, league, leagueID){
    let output = "";console.log(league);
    let position = 0;
    for (let i in league){
        position++;
        let team = league[i];
        output += "<tr>";
        output += "<td>";
        output += "<span>"+position+"</span>";
        output += "<figure><img src="+team.username+" ></figure>";
        output += "<div class='player-stats-text'>";
        output += "<h6>"+team.team+"</h6>";
        output += "<span>"+team.username+"</span>";
        output += "</div>";
        output += "</td>";
        output += "<td>";
        output += team.w;
        output += "</td>";
        output += "<td>";
        output += team.l;
        output += "</td>";
        output += "<td>";
        output += team.d;
        output += "</td>";
        output += "<td>";
        output += team.indUp;
        output += "</td>";
        output += "<td>";
        output += team.indDown;
        output += "</td>";
        output += "<td>";
        output += team.indDiff;
        output += "</td>";
        output += "<td>";
        output += team.pts;
        output += "</td>";
        output += "</tr>";
    }
    $("#"+leagueID+"-table tbody").append(output);
}
console.log(league1Table, "league table");
