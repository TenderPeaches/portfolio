function Customer(info) {
    this.name = info.name;
    
    this.address = info.address;
    this.postal = info.postal;
    this.phoneHome = info.phoneHome;
    this.phoneMobile = info.phoneMobile;
    this.phoneOther = info.phoneOther;
    
    this.emergencyName = info.emergencyName;
    this.phoneEmergency = info.phoneEmergency;
    this.vetName = info.vetName;
    this.phoneVet = info.phoneVet;
    
    this.plants = info.plants;
    this.food = info.food;
    this.gear = info.gear;
    
    this.other = info.other;   
}

function Dog(info) {
    this.name = info.name;
    this.gender = info.gender;
    this.breed = info.breed;
    
    this.birthYear = info.birthYear;
    this.adoptedWhen = this.adoptedWhen;
    this.adoptedWhere = this.adoptedWhere;
    this.vaccined = this.vaccined;
    this.neutered = this.neutered;   
    
    this.health = info.health;
    this.reactivity = info.reactivity;
    this.anxiety = info.anxiety;
    this.biting = info.biting;
    this.other = info.other;
}

function HousePet(info) {
    this.name = info.name;
    this.specie = info.specie;
    this.care = info.care;   
}