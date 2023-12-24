function Walk(walkInfo) {
    // ID of the customer for which this walk was ordered
    this.ID = walkInfo.ID;
    
    this.type = 'walk';
    
    this.zip = walkInfo.zip;
    
    this.date = walkInfo.date;
        
    this.earlyTime = walkInfo.earlyTime;
    this.lateTime = walkInfo.lateTime;
    
    this.duration = walkInfo.duration;
    this.private = walkInfo.private;
    
    this.estimate = function() {
        // Base cost for a short walk or 1hr house sitting in zone 0
        var baseCost = 18;
        var zone = GetZone(this.zip);
        
        // Adjust the cost according to the zone the client is located in
        switch (zone) {
            // Base cost 
            case 0: 
                // Cost adjustment for a long walk         
                if (this.duration == 'long') {
                    baseCost += 3;
                    // Cost adjustment for a private walk
                    baseCost += this.private ? 4 : 0;     
                }
                else {
                    // Cost adjustment for a short private walk
                    baseCost += this.private ? 3 : 0; 
                }   
                break;
            case 1:
                // Base cost is 21 for Zone 1
                baseCost += 3;
                if (this.duration == 'long') {
                    baseCost += 4;
                    baseCost += this.private ? 5 : 0;
                }
                else {
                    baseCost += this.private ? 4 : 0;   
                }
                break;
            case 2:
                // Base cost of 24
                baseCost += 6;
                if (this.duration == 'long') {
                    baseCost += 5;
                    baseCost += this.private ? 6 : 0;
                }
                else {
                    baseCost += this.private ? 5 : 0;   
                }
                break;
            case 3:
                // Base cost of 28
                baseCost += 10;
                if (this.duration == 'long') {
                    baseCost += 5;
                    baseCost += this.private ? 7 : 0;   
                }
                else {
                    baseCost += this.private ? 5 : 0;
                }
                break;
            default:
                baseCost += 18;
                if (this.duration == 'long') {
                    baseCost += 18;    
                }
            
        }
        
        return baseCost;  
    };
}

function GetZone(zip) {
    var code = zip.substring(0, 3);
    
    // Matches the following :
    // H2S H2G H2H H2J H2T H2V H2R H2E H3N    
    if (/^[hH](2[sSgGhHjJtTvVrReE]|3[nN])$/.test(code)) {
        return 0;   
    }
    // H2A H2K H2L H2P H2X H1X H1Y
    else if (/^[hH](2[aAkKlLpPxX]|1[yYxX])$/.test(code)) {
        return 1;
    }
    // H1T H1V H1W H2M H2N H3G H3H H3L H3P H3R H3S H3T H3V
    else if (/^[hH](1[tTvVwW]|2[mMnN]|3[gGhHlLpPrRsStTvV])$/.test(code)) {
        return 2;
    }
    // H1M H1N H1T H2Y H3J H3X H3Y H3Z H4A H4L H4N 
    else if (/^[hH](1[mMnNtT]|2[yY]|3[jJxXyYzZ]|4[aAlLnN])$/.test(code)) {
        return 3;
    }
    return 4;
}
