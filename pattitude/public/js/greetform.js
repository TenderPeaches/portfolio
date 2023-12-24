var greetForm = new function() {
  
    this.addDogButton = $('#add_dog');
    this.addPetButton = $('#add_housepet');
    
    this.vetName = $('#in_vet');
    this.vetPhone = $('#in_phone_vet');
    
    this.dogName = $('#in_dog_name');
    this.dogBirthYear = $('#in_dog_birth_year');
    this.dogVaccined = $('#in_vaccined');
    this.dogNeutered = $('#in_neutered');
    this.dogAdoptedWhen = $('#in_adopted_when');
    this.dogAdoptedWhere = $('#in_adopted_where');
    this.dogBreed = $('#in_breed');
    this.dogHealth = $('#in_health');
    this.dogReactivity = $('#in_reactivity');
    this.dogAnxiety = $('#in_anxiety');
    this.dogBiting = $('#in_biting');
    this.dogOther = $('#in_behavior_extra');
    
    this.petName = $('#in_pet_name');
    this.petSpecie = $('#in_pet_specie');
    this.petCare = $('#in_pet_care');
    
    this.dogListHtml = $('#dog_list');
    this.petListHtml = $('#housepet_list');
    
    this.dogList = new Array();
    this.petList = new Array();
    
    this.houseSitEnabled = $('#housesit_enabled');
    
    this.AddDog = function() {
        // Creating a new dog object from the values inputted, while replacing potentially dangerous characters
        // to prevent XSS
        var added = new Dog(
            {
                name: this.dogName.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                gender: $('input[name=dog_gender]:checked').val(),
                birthYear: this.dogBirthYear.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                breed: this.dogBreed.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                vaccined: this.dogVaccined.is(':checked'),
                neutered: this.dogNeutered.is(':checked'),   
                adoptedWhen: this.dogAdoptedWhen.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                adoptedWhere: this.dogAdoptedWhere.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                health: this.dogHealth.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                reactivity: this.dogReactivity.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                anxiety: this.dogAnxiety.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                biting: this.dogBiting.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                other: this.dogOther.val().replace(/</g, "&lt;").replace(/>/g, "&gt;")
            });
            
        added.index = this.dogList.length;
        
        // Add the new dog onto the list
        this.dogList.push(added);
        
        this.dogListHtml.append('<span class="dog_header">' + added.name + ' (' + added.breed + ')</span>');
    };
        
    this.addDogButton.on('click', $.proxy(this.AddDog, this));
    
    this.AddPet = function() {
        // Creating a housepet object, again replacing potentially dangerous characters to prevent XSS
        var added = new HousePet({
            name: this.petName.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
            specie: this.petSpecie.val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
            care: this.petCare.val().replace(/</g, "&lt;").replace(/>/g, "&gt;")
        });
        
        added.index = this.dogList.length;
        
        // Add the new pet onto the list
        this.petList.push(added);
        
        this.petListHtml.append('<span class="pet_header">' + added.name + ' (' + added.specie + ')</span');
    }; 
    
    this.addPetButton.on('click', $.proxy(this.AddPet, this));
    
    this.houseSitEnabled.on('change', function() {
        if ($(this).is(':checked')) {
            $('#housepet_form').show();
            $('#housesit_form').show();   
         } 
        else {
            $('#housepet_form').hide();
            $('#housesit_form').hide();   
        }
    });
    
    
};