document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pondfillers').addEventListener('click', home);
    document.getElementById('pondTS').addEventListener('click', teamspeak);
    document.getElementById('query').addEventListener('click', getUserName);
});

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

function faceit(uid_check){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
	    if (this.readyState == 4 && this.status == 200) {
	        myObj = JSON.parse(this.responseText);
	        // document.getElementById("faceit_name").innerHTML ="";
	        // document.getElementById("faceit_name").innerHTML = uid_check;
	        document.getElementById("faceit").innerHTML ="";
	        document.getElementById("faceit").innerHTML += "ELO: " + myObj.payload.games.csgo.faceit_elo + "<br> Level: " + myObj.payload.games.csgo.skill_level;
	    }
	    else
	    {
	    	document.getElementById("faceit").innerHTML ="";
	    	document.getElementById("faceit").innerHTML = "User not found";
	    }
	};
	var url = "https://api.faceit.com/core/v1/nicknames/";
	xmlhttp.open("GET", url + uid_check, true);
	xmlhttp.send();
}
