function steamIDToProfile(steamID)
{    
    var parts = steamID.split(":");
    
    var iServer = Number(parts[1]);
    var iAuthID = Number(parts[2]);
    
    var converted = "76561197960265728"

    lastIndex = converted.length - 1

    var toAdd = iAuthID * 2 + iServer;
    var toAddString = new String(toAdd)    
    var addLastIndex = toAddString.length - 1;

    for(var i=0;i<=addLastIndex;i++)
    {
        var num = Number(toAddString.charAt(addLastIndex - i));
        var j=lastIndex - i;
        
        do
        {
            var num2 = Number(converted.charAt(j));            
            var sum = num + num2;        
                    
            converted = converted.substr(0,j) + (sum % 10).toString() + converted.substr(j+1);    
        
            num = Math.floor(sum / 10);            
            j--;
        }
        while(num);
            
    }

    return converted;
}

function profileToSteamID(profile)
{
    var base = "7960265728"
    var profile = profile.substr(7)
    
    var subtract = 0
    var lastIndex = base.length - 1
    
    for(var i=0;i<base.length;i++)
    {
        var value = profile.charAt(lastIndex - i) - base.charAt(lastIndex - i)
        
        if(value < 0)
        {
            var index = lastIndex - i - 1
            
            base = base.substr(0,index) + (Number(base.charAt(index)) + 1) + base.substr(index+1)
            
            if(index)
            {
                value += 10
            }
            else
            {
                break
            }
        }
        
        subtract +=  value * Math.pow(10,i)
    }
    
    return "STEAM_0:" + (subtract%2) + ":" + Math.floor(subtract/2)
}