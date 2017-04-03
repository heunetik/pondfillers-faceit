document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('pondfillers').addEventListener('click', home);
	document.getElementById('kdr_3').addEventListener('click', kd_stats);
	document.getElementById('kdr_l').addEventListener('click', l_kd_stats); 
	document.getElementById('query').addEventListener('click', getUserName);
	/*
	document.getElementById('query').addEventListener("keyup", function(event)
		{
			event.preventDefault();
			if (event.keyCode == 13)
			{
	  	  		//document.getElementById('query').click();
	  	  		alert("123 test");
			}
	});
	*/
	// latest addition
	document.querySelector("input[class=f_input]").addEventListener('keypress', function (e)
	{
	    var key = e.which || e.keyCode;
	    if (key === 13)
	    {
	    	e.preventDefault();
	    	getUserName();
		}
	});
});

function hideShow(fName)
{
	if(document.getElementById("kdr").style.display == "none" && fName != 0)
	{
		document.getElementById("kdr").style.display="block";
	}
	if(document.getElementById("kdr").style.display == "block" && fName == 0)
	{
		document.getElementById("kdr").style.display="none";
	}	
}

function home()
{
    chrome.tabs.create({ 'url': "http://steamcommunity.com/groups/pondfillers" });
}

function teamspeak()
{
    chrome.tabs.create({ 'url': "ts3server://pondfillers.clanvoice.net?password=nincspw"});
}

function steamcommunity_profile(steamid)
{
	var link = "http://steamcommunity.com/profiles/" + steamid;
    //chrome.tabs.create({ url: link });
    document.getElementById("steamlink").href = link;
}

function getUserName() {
	//preventDefault();
    var nameField = document.getElementById('nameField').value;
    //document.getElementById("nameField").value ="";
    faceit(nameField);
}

function faceit(fName){
	document.getElementById("kd").innerHTML = "";
	document.getElementById("faceit").innerHTML = "";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
	    if (this.readyState == 4 && this.status == 200) {
	        myObj = JSON.parse(this.responseText);
	        un_id = myObj.payload.guid;
	        var cflag;
	        var steamid = myObj.payload.games.csgo.game_id;
	        steamcommunity_profile(steamid);
	        cflag = myObj.payload.country;
	        cflag = cflag.toUpperCase();
	        document.getElementById("flag").src = "https://cdn.faceit.com/frontend/335/assets/images/flags/" + cflag + ".png";
	        // document.getElementById("faceit_name").innerHTML ="";
	        // document.getElementById("faceit_name").innerHTML = fName;
	        document.getElementById("faceit").innerHTML = "";
	        document.getElementById("faceit").innerHTML += "ELO: " + myObj.payload.games.csgo.faceit_elo + "<br> Level: " + myObj.payload.games.csgo.skill_level;
	    }
	    else
	    {
	    	document.getElementById("flag").src = "";
	    	document.getElementById("faceit").innerHTML = "";
	    	document.getElementById("faceit").innerHTML = "User not found";
	    }
	};
	var url = "https://api.faceit.com/core/v1/nicknames/";
	xmlhttp.open("GET", url + fName, true);
	xmlhttp.send();
	hideShow(fName);
	fName = "";
	// http://steamcommunity.com/profiles/
}

function kd_stats(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function () {
	    if (this.readyState == 4 && this.status == 200) {
	        jObj = JSON.parse(this.responseText);
	        var kills = 0;
	        var deaths = 0;
	        var k_d = 0;
	        for(var i=0; i<3; i++)
	        {
	        	match = jObj[i];
	        	kills = kills + parseFloat(match.i6);
	        	deaths = deaths + parseFloat(match.i8);
	        }
	        k_d = kills / deaths;
	        k_d = k_d.toFixed(2);
	        var textz = document.getElementById("faceit").innerHTML;
	        document.getElementById("kd").innerHTML = "K/D " + k_d;
	        k_d = 0;
	    }
	};
	var url = "https://api.faceit.com/stats/v1/stats/time/users/";
	var url_p2 = "/games/csgo?page=0&size=3";
	xmlhttp.open("GET", url + un_id + url_p2, true);
	xmlhttp.send();
	// 06b6394e-795d-4e8e-bfd3-79f9581607b1 = heuID
	// 48f9db99-b075-4f86-9286-250692c14325 = RickyID
}

function l_kd_stats(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function () {
	    if (this.readyState == 4 && this.status == 200) {
	        jObj = JSON.parse(this.responseText);
	        document.getElementById("kd").innerHTML = "K/D " + jObj.lifetime.k5 + " @ " + jObj.lifetime.m1;
	    }
	};
	var url = "https://api.faceit.com/stats/v1/stats/users/";
	var url_p2 = "/games/csgo";
	xmlhttp.open("GET", url + un_id + url_p2, true);
	xmlhttp.send();
	// 06b6394e-795d-4e8e-bfd3-79f9581607b1 = heuID
	// 48f9db99-b075-4f86-9286-250692c14325 = RickyID
}
