/*

	pondfillers' Faceit stats Chrome Extension
    Copyright (C) 2017  heunetik

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
   
*/

document.addEventListener('DOMContentLoaded', function () {
	
	checkLocalData();
	document.getElementById('query').addEventListener('click', getUserName);
	$("#query").on("click", getUserName(), false);
	document.querySelector("input[class=textbox]").addEventListener('keypress', function (e) {
	    var key = e.which || e.keyCode;
	    if (key === 13) {
	    	e.preventDefault();
	    	getUserName();
		}
	});

    var news = '<p class="sizeonefour">The new checkbox serves as the toggle for the inclusion of aim_maps in the K/D calculation.</p><p class="sizeonefour">TOGGLED = all maps<br><br>UNTOGGLED = "de_" maps only</p>';
    $("#updates").append(news);
    $("#pondfillers").click(function () {
        if($("#mainContent").is(":visible")) {
            $("#mainContent").hide();
            $("#news").show();
        } else {
            $("#mainContent").show();
            $("#news").hide();
        }
    });

    $("#aimKD").click(function () {
        if($('#aimKD').is(':checked')) {
            localStorage.aimkd = true;
        } else {
            localStorage.aimkd = false;
        }
        getUserName();
    });

});

function calculate(currentElo) {
    var maxElo = 3000; 
    var perc="";

    if(isNaN(maxElo) || isNaN(currentElo)) {
       perc=" ";
    } else {
       perc = ((currentElo / maxElo) * 100).toFixed(1);
    }

    if(perc >= 100) {
    	return 100
    }

    return perc;
}

function progress(percent, $element, elo) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({
    	width: progressBarWidth
    }, 500).html(elo);

    if (elo < 800) {
    	$element.find('div').css( "background-color", "#D3D3D3" );
    } else if (elo < 1100) {
    	$element.find('div').css( "background-color", "#1A9405" );
    } else if (elo < 1700) {
    	$element.find('div').css( "background-color", "#FFCC00" );
	} else if (elo < 2000) {
    	$element.find('div').css( "background-color", "#FF6000" );
	} else {
    	$element.find('div').css( "background-color", "#FF0A0A" );
    }
}

function checkLocalData()
{
	chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 230]});

	if (localStorage.mysetting == null)
		localStorage.mysetting = "0000";

    if(localStorage.aimkd == null) {
        localStorage.aimkd = false;
    }

	chrome.browserAction.setBadgeText({
		text : localStorage.mysetting.toString()
	});
}
function getUserName() {
    var nameField = document.getElementById('nameField').value;

    $('#stats').hide();

    if(nameField.length != 0) {
    	faceit(nameField);
    } else if(localStorage.faceitname !== undefined) {
    	faceit(localStorage.faceitname);
    }
}

function steamcommunity_profile(steamid)
{
	$('#steamlink').attr("href", "http://steamcommunity.com/profiles/" + steamid );
}

function faceit(fName)
{
	var faceit = $('#faceit');
	faceit.html(" ");
	$('#flag').attr("src", '' );
	$.getJSON('https://api.faceit.com/core/v1/nicknames/'+fName, function(json)
	{
        un_id = json.payload.guid;
		var cflag = json.payload.country;
        var isTrue = (localStorage.aimkd == "true");
		cflag = cflag.toUpperCase();
		elo = json.payload.games.csgo.faceit_elo;
		skillLevel = json.payload.games.csgo.skill_level;

		$('#flag').attr("src", 'https://cdn.faceit.com/frontend/335/assets/images/flags/' + cflag + '.png' );
		$('#steam').attr("src", 'icons/steam_v2.png' );
		$("#faceit").attr('title', eloToLevel(elo) + ' elo needed for the next level!');

        $('#aimKD').prop('checked', isTrue);
        $("#aimKD").attr('title', 'Check this box to enable aim_map K/D ratio');

		steamcommunity_profile(json.payload.steam_id_64);
		
	    faceit.html("ELO: " + elo + "<br> Level: " + skillLevel);
	    progress(calculate(elo), $('#progressBar'), elo);

	    chrome.browserAction.setBadgeBackgroundColor({
	    	color:[255, 0, 0, 230]
	    });
		chrome.browserAction.setBadgeText({
			text : elo.toString()
		});

		localStorage.mysetting = elo;
	    localStorage.faceitname = fName;

	}).done(function() {
		lastThreeStats(un_id,faceit);
		$('#stats').show();
		$('#steamlink').show();
	    $('#steam').show();
        $('#aimKD').show();
  	})

  	.fail(function(){
  		progress(0, $('#progressBar'), 0);
		$('#faceit').html("User not found");
		$('#stats').show();
        $('#steam').hide();
		$('#aimKD').hide();
	});
}

function eloToLevel(elo)
{
	var eloDiff = 0;
	var levelSteps = [ 0, 800, 950, 1100, 1250, 1400, 1550, 1700, 1850, 2000 ];

	for (var i = 0, len = levelSteps.length; i < len; i++) {
		if(elo <= levelSteps[i]) {
			eloDiff = levelSteps[i] - elo;
			break;
		}
	}
	
	if(eloDiff == 0) {
		return eloDiff;
	} else {
		return ++eloDiff;
	}
}

function lastThreeStats(un_id,faceit)
{
	$.getJSON('https://api.faceit.com/stats/v1/stats/time/users/'+ un_id +'/games/csgo?page=0&size=3', function(jObj)
	{
		var kills = 0;
	    var deaths = 0;
	    var k_d = 0;

		for(var i=0; i<3; i++) {
        	match = jObj[i];
        	kills = kills + parseFloat(match.i6);
        	deaths = deaths + parseFloat(match.i8);
	    }

	    k_d = kills / deaths;
	    k_d = k_d.toFixed(2);
	    faceit.append("<br>K/D: " + k_d + " @ last 3");

	}).done(function() {
    	lifetimeStats(un_id,faceit);
  	});
}

function lifetimeStats(un_id,faceit)
{
    $.getJSON('https://api.faceit.com/stats/v1/stats/users/'+ un_id +'/games/csgo', function(jObj)
    {
        if(localStorage.aimkd == "true") {
            faceit.append("<br>K/D: " + jObj.lifetime.k5 + " @ " + jObj.lifetime.m1);
        } else {
            var totalKD = 0;
            var mapCount = 0;
            var re = /de\_/i;
            Object.entries(jObj.segments[0].segments).forEach(
                ([key, value]) => {
                    if(key.match(re)) {
                        mapCount++;
                        totalKD += parseFloat(value.k5);
                    }
                }
            );
            totalKD = totalKD/mapCount;
            faceit.append("<br>K/D: " + totalKD.toFixed(2) + " @ " + jObj.lifetime.m1);
        }
    });
}