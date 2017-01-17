document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pondfillers').addEventListener('click', home);
    document.getElementById('pondTS').addEventListener('click', teamspeak);
});

function home()
{
    chrome.tabs.create({ 'url': "http://steamcommunity.com/groups/pondfillers" });
}

function teamspeak()
{
    chrome.tabs.create({ 'url': "ts3server://pondfillers.clanvoice.net?password=nincspw"});
}
