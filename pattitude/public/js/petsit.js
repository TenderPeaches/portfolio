function Petsit(sitInfo) {
    // ID of the customer for which this walk was ordered
    this.customerID = sitInfo.customerID;
    this.ID = sitInfo.ID;
    
    this.type = "petsit";
    
    this.zip = sitInfo.zip;
    
    
    this.date = sitInfo.date;
    this.startTime = sitInfo.startTime;
    this.endTime = sitInfo.endTime;
    this.overnight = sitInfo.overnight;
    this.overnightType = sitInfo.overnightType;
    
    this.estimate = function() {
        var baseCost = 18;
        var zone = GetZone(this.zip);
        
        // In a non-overnight stay
        if (!this.overnight) {
            // Adjust the hourly rate according to the size
            switch (zone) {
                case 1:
                    baseCost = 21;
                    break;
                case 2:
                    baseCost = 24;
                    break;
                case 3:
                case 4:
                    baseCost = 28;
                    break;
            }
            
            // Hourly rate * duration of the stay
            baseCost = baseCost * (this.endTime - this.startTime);
        }
        // Otherwise, this is an overnight stay
        else {
            switch (zone) {
                case 0:
                    baseCost = this.overnightType === 'simple' ? 60 : 80;
                    break;
                case 1:
                    baseCost = !this.overnightType === 'simple' ? 68 : 92;
                    break;
                case 2:
                    baseCost = !this.overnightType === 'simple' ? 78 : 106;
                    break;
                case 3:
                case 4:
                    baseCost = !this.overnightType === 'simple' ? 90 : 120;        
            }     
        
        }
        
        return baseCost;  
    };
}