document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pondfillers').addEventListener('click', home);
    document.getElementById('kdr').addEventListener('click', kd_stats);
    document.getElementById('query').addEventListener('click', getUserName);
});

function hideShow(fName)
{
	if(document.getElementById("kdr").style.display == "none" && fName != 0)
		document.getElementById("kdr").style.display="block";
	if(document.getElementById("kdr").style.display == "block" && fName == 0)
		document.getElementById("kdr").style.display="none";
}

function home()
{
    chrome.tabs.create({ 'url': "http://steamcommunity.com/groups/pondfillers" });
}

function teamspeak()
{
    chrome.tabs.create({ 'url': "ts3server://pondfillers.clanvoice.net?password=nincspw"});
}

function getUserName() {
    var nameField = document.getElementById('nameField').value;
    //document.getElementById("nameField").value ="";
    faceit(nameField);
}

function faceit(fName){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
	    if (this.readyState == 4 && this.status == 200) {
	        myObj = JSON.parse(this.responseText);
	        un_id = myObj.payload.guid;
	        var cflag;
	        cflag = myObj.payload.country;
	        cflag = cflag.toUpperCase();
	        document.getElementById("flag").src = "https://cdn.faceit.com/frontend/335/assets/images/flags/" + cflag + ".png";
	        // document.getElementById("faceit_name").innerHTML ="";
	        // document.getElementById("faceit_name").innerHTML = fName;
	        document.getElementById("faceit").innerHTML ="";
	        document.getElementById("faceit").innerHTML += "ELOL: " + myObj.payload.games.csgo.faceit_elo + "<br> Level: " + myObj.payload.games.csgo.skill_level;
	    }
	    else
	    {
	    	document.getElementById("faceit").innerHTML ="";
	    	document.getElementById("faceit").innerHTML = "User not found";
	    	document.getElementById("flag").src = "";
	    }
	};
	var url = "https://api.faceit.com/core/v1/nicknames/";
	xmlhttp.open("GET", url + fName, true);
	xmlhttp.send();
	hideShow(fName);
	fName = "";
}

function kd_stats(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
	    if (this.readyState == 4 && this.status == 200) {
	        jObj = JSON.parse(this.responseText);
	        var kills = 0;
	        var deaths = 0;
	        var k_d = 0;
	        for(var i=0; i<3; i++)
	        {
	        	kills = kills + parseFloat(jObj[i].i6);
	        	deaths = deaths + parseFloat(jObj[i].i8);
	        }
	        k_d = kills / deaths;
	        k_d = k_d.toFixed(2);
	        var textz = document.getElementById("faceit").innerHTML;
	        document.getElementById("faceit").innerHTML = textz + "<br> K/D " + k_d;
	        k_d = 0;
	        un_id=0;
	    }
	};
	var url = "https://api.faceit.com/stats/v1/stats/time/users/";
	var url_p2 = "/games/csgo?page=0&size=3";
	xmlhttp.open("GET", url + un_id + url_p2, true);
	xmlhttp.send();
	// 06b6394e-795d-4e8e-bfd3-79f9581607b1 = heuID
	// 48f9db99-b075-4f86-9286-250692c14325 = RickyID
}
