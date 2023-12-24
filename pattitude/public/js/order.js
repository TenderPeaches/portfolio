$(function() {
    $.datepicker.setDefaults( {
        dayNamesMin: [ 'Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa' ],
        nextText: '&#10095',
        prevText: '&#10094',
        monthNames: [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
        dateFormat: 'dd/mm/y',
        minDate: 1
        });
    
});

var orderForm = new function() {
    const itemsPerCartPage = 5;
    
    // Output of the estimate cost of the walk, factoring in all parameters
    this.estimate = $('#estimate');
    
    this.walkForm = $('#walk_form');
    this.petsitForm = $('#petsit_form');

    // First 3 characters of the user's postal code
    this.postalShort = $('#in_zip');
    
    // Requested date of a one-off walk
    this.walkSingleDate = $('#in_date_single').datepicker();
    // Starting date of a recurring series of walks
    this.walkStartDate = $('#in_start_date_rec').datepicker();
    // Ending date of a recurring series of walks
    this.walkEndDate = $('#in_end_date_rec').datepicker();
    
    // Earliest convenient time of the walk
    this.earlyTime = $('#in_time_early');
    // Latest convenient time of the walk
    this.lateTime = $('#in_time_late');
    // Radio buttons which allow choosing the duration of the walk
    this.durationRadioButtons = $('#duration_radio');
    // Checkbox indicating whther or not the walk should be private
    this.privateWalk = $('#in_private_walk');
    
    // Date of the petsit
    this.petsitDate = $('#in_petsit_date').datepicker();
    
    // Time at which the petsit starts
    this.startTime = $('#in_start_hour');
    // Time at which the petsit ends
    this.endTime = $('#in_end_hour');
    
    // Overnight options
    this.overnightOptions = $('#overnight_options');
    
    this.submit = $('#order_submit');
    
    this.cartDisplay = $('#cart_display');
    this.addItemButton = $('#add_item_button');
    this.removeItemButton = $('#remove_item_button');
    this.itemList = new Array();
    
    // Walk selected by the user
    this.selectedItem = null;
    
    this.itemCount = 0;
    this.GetItemID = function() {this.itemCount++; return this.itemCount - 1;};
    
    // Initialize the tabs' event handers
    this.singleWalkTab = $('#single_tab');
    this.recurringWalkTab = $('#recurring_tab');
    this.walkTab = $('#walk_tab');
    this.petsitTab = $('#housestay_tab');
    this.petStopTab = $('#pet_stop_tab');
    this.overnightTab = $('#overnight_tab');
    
    this.firstTimeChoice = $('#first_time_choice input[type=radio][name=first_time]');
    this.firstTimeText = $('#first_time_text');
    this.firstTimeSubmit = $('#first_time_submit');
    
    this.customerName = $('#in_client_name');
    this.customerInfo = $('#in_client_contact');
    
    this.ToggleForms = function() {
        if ($('#first_time_choice input[type=radio]:checked').val() === 'yes') {
            // Hide the "first time" prompt
            $('#first_time_form').hide();
            $('#order_form').show();
        }
        else {
            $('#first_time_form').show();
            $('#order_form').hide();
        }  
    };
    this.ToggleForms();
    this.firstTimeChoice.on('change', $.proxy(this.ToggleForms, this));
    
    this.FirstTimeSubmit = function(event) {
        $.post('php/handleFirst.php', this.firstTimeText.val(), $.proxy(function(response) {
            this.firstTimeText.val('');
            
            $('#first_time_feedback').html($('html').attr('lang') === 'fr' ? 
                'Votre demande a été envoyée avec succès et nous y répondrons sous peu.' :
                'Your request has been successfully sent and we will answer it shortly.');
        }, this));
    };
    this.firstTimeSubmit.on('click', $.proxy(this.FirstTimeSubmit, this));
    
    // Update the walk's estimated cost
    this.UpdateEstimate = function() {
        var estimate = 0;
        var walks = 0;
        
        for (var i = 0; i < this.itemList.length; ++i) {
            estimate += this.itemList[i].estimate();
            
            if (this.itemList[i].type === 'walk') {
                ++walks;   
            }
        }
        
        // If there are 5 or more walks
        if (walks >= 5) {
            // 10% discount
            estimate *= 0.9;   
        }
        
        if($('html').attr('lang') == 'fr') {
            
            this.estimate.html('Estimé du coût (taxes incluses) : ' + estimate.toFixed(2).replace('.', ',') + '$');   
        }
        else {
            this.estimate.html('Cost estimate (tax included): $' + estimate.toFixed(2));   
        }
        
    };
    
    // Initialize the estimate to 0,00$
    this.UpdateEstimate();
    
    this.GenerateWalk = function() {
        // If a single walk is ordered, the corresponding form is visible
        var isSingle = $('#single_form').is(":visible");
        
        if (isSingle) {
            // Generate a new walk according to the parameters specified by the user
            var generated = new Walk({
                ID: this.GetItemID(),
                zip: this.postalShort.val(),
                date: new Date(this.walkSingleDate.datepicker('getDate')),
                earlyTime: this.earlyTime.val(),
                lateTime: this.lateTime.val(),
                duration: $('input[name=walk_duration]:checked').val(),     
                private: this.privateWalk.is(':checked')       
            });
            
            // Push the generated walk onto the cart
            this.AddItemToCart(generated);
        }
        // Otherwise, recurring walks need to be added one at a time
        else {
            // The added date is set as the starting date for the recurring walks
            var addedDate = new Date(this.walkStartDate.datepicker('getDate'));
            // The final date is set according the date specified by the user
            var finalDate = new Date(this.walkEndDate.datepicker('getDate'));
            
            // Milliseconds per day
            var milsecPerDay = 1000 * 60 * 60 * 24;
            
            var addedQty = Math.round(Math.abs(finalDate.getTime() - addedDate.getTime()) / milsecPerDay) + 1;
            var i = 0;
            
            // Loop on every day until the added date reaches the final date
            while (i < addedQty) {
                // Add the day's walk to the cart
                this.AddItemToCart(new Walk({
                    ID: this.GetItemID(),
                    zip: this.postalShort.val(),
                    date: addedDate,
                    earlyTime: this.earlyTime.val(),
                    lateTime: this.lateTime.val(),
                    duration: $('input[name=walk_duration]:checked').val(),
                    private: this.privateWalk.is(':checked')
                }));
                
                
                // Increment the current date by 1 day
                addedDate = new Date(addedDate.getFullYear(), addedDate.getMonth(), addedDate.getDate());
                addedDate.setDate(addedDate.getDate() + 1);
                ++i;
            } 
        }
    };
    
    this.GeneratePetsit = function() {
        // Generate a new petsit according to the parameters specified by the user
        this.AddItemToCart(new Petsit({
            ID: this.GetItemID(),
            zip: this.postalShort.val(),
            date: new Date(this.petsitDate.datepicker('getDate')),
            startTime: this.startTime.val(),
            endTime: this.endTime.val(),
            overnight: $('#overnight_form').is(':visible'),        
            overnightType: $('input[name=overnight]:checked').val()
        }));
          
    };
    
    // Initialize the "add item" button event handler
    $('#add_item_button').on('click', $.proxy(function(event) {
        event.preventDefault();
        
        
        // If the walk form is visible
        if (this.walkForm.is(':visible')) {
            // Generate a walk
            this.GenerateWalk();   
        }
        // Otherwise, the petsit form is visible
        else {
            // Generate a petsit
            this.GeneratePetsit();   
        }
        
        this.ManageSubmitButton();
        }, this));
    
    this.AddItemToCart = function(added) {
        // Store the index of the walk within the list
        added.index = this.itemList.length;
        // Push the walk onto the list 
        this.itemList.push(added); 
        // If item is a walk
        if (added.type === 'walk') {       
            // French
            if($('html').attr('lang') === 'fr') {
             
            this.cartDisplay.append('<div class="walk_header" id="header_' + added.index + '">Marche : ' + added.date.getDate() + '/' 
                    + (added.date.getMonth() + 1) + '/' + added.date.getFullYear()
                    + ', entre ' + added.earlyTime + 'h00 et ' + added.lateTime + 'h00, ' +
                    (added.duration == "short" ? 'courte' : 'longue') + '</div>');   
            }
            else {
                
            this.cartDisplay.append('<div class="walk_header" id="header_' + added.index + '">Walk : ' + added.date.getDate() + '/' 
                    + (added.date.getMonth() + 1) + '/' + added.date.getFullYear()
                    + ', between ' + added.earlyTime + ':00 and ' + added.lateTime + ':00, ' +
                    (added.duration == "short" ? 'short' : 'long') + '</div>');   
            }
        }
        // Otherwise item is a petsit
        else {     
            // The item is added on the cart
            this.cartDisplay.append('<div class="petsit_header" id="header_' + added.index + '">Pet sitting : ' + added.date.getDate() + '/' 
                + (added.date.getMonth() + 1) + '/' + added.date.getFullYear()
                + ', ' + (added.overnight ? added.overnightType === 'simple' ? 'simple overnight' : 'full overnight' :  
                'between ' + added.startTime + ':00 et ' + added.endTime + ':00</div>'));
        }
        // Add a click listener to the petsit that was just added
        this.cartDisplay.children().last().on('click', $.proxy(this.HandleItemClick, this));

        // Update the estimate
        this.UpdateEstimate();
        
        this.ManageAddButton();
    };
    
    this.ValidateDate = function(validated) {
        
        // Validate the format of the date. Works up to the year 2029
        var formatMatch = /^([0-2][0-9]|[3][01])\/([0][1-9]|[1][0-2])\/([12][0-9])$/.exec(validated);
        
        // If no match, the entered date is not of the correct format
        if (formatMatch == null) {
            return false;   
        }
        
        var date = formatMatch[1];
        // -1 since january is considered "month 0"
        var month = formatMatch[2] - 1;
        // Adding the suffix to create a 20__ year
        var year = '20' + formatMatch[3];
        
        // If the date is before today
        if (new Date().setHours(0,0,0,0) > new Date(year, month, date).setHours(0,0,0,0)) {
            return false;
        }
        
        // Number of days in each month
        var daysPerMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
            daysPerMonth[1] = 29;   
        }
        
        // The only other validation is whether the date fits within the month
        return date <= daysPerMonth[month];
    };
    
    // Enables or disables the "add item" button according to the user's input (or lack therof)
    this.ManageAddButton = function() {
        // Whether the button should be enabled
        var enabled = false;
        // If the walk form is active
        if (this.walkForm.is(':visible')) {
            // Validate the postal code
            enabled = /^[hHjJ][0-9][a-zA-Z]$/.test(this.postalShort.val());
            
            // There needs to be a valid date inputted
            enabled = this.ValidateDate(this.walkSingleDate.val()) || this.ValidateDate(this.walkStartDate.val()) && this.ValidateDate(this.walkEndDate.val());
            // Validate the times entered
            enabled = enabled && /^([01]?[0-9]|[2][0-3])$/.test(this.earlyTime.val()) 
                && /^([01]?[0-9]|[2][0-3])$/.test(this.lateTime.val());
                
             // The late time must be later than the early time
             enabled = enabled && this.earlyTime.val() <= this.lateTime.val();   
            }
        // Otherwise, the petsit form is active
        else {
            // Validate the postal code
            enabled = /^[hHjJ][0-9][a-zA-Z]$/.test(this.postalShort.val());
            
            // There needs to be a valid date inputted
            enabled = this.ValidateDate(this.petsitDate.val());
            
            // Validate the times entered or overnight form visible
            enabled = enabled && (/^([01]?[0-9]|[2][0-3])$/.test(this.startTime.val()) 
                && /^([01]?[0-9]|[2][0-3])$/.test(this.endTime.val()) && this.startTime.val() <= this.endTime.val() || $('#overnight_form').is(':visible'));
        }
       
        // The 'add item' button is disabled if $enabled == FALSE and it's enabled if $enabled == TRUE
        this.addItemButton.prop('disabled', !enabled);
    };
    
    // Evaluate the validity of adding a walk right from the start
    this.ManageAddButton();
    // The add walk button is checked anytime one of the input may have been changed, which is caught when they lose focus
    this.postalShort.on('change', $.proxy(this.ManageAddButton, this));
    this.walkSingleDate.on('change', $.proxy(this.ManageAddButton, this));
    this.walkStartDate.on('change', $.proxy(this.ManageAddButton, this));
    this.walkEndDate.on('change', $.proxy(this.ManageAddButton, this));
    this.earlyTime.on('change', $.proxy(this.ManageAddButton, this));
    this.lateTime.on('change', $.proxy(this.ManageAddButton, this));
    this.startTime.on('change', $.proxy(this.ManageAddButton, this));
    this.endTime.on('change', $.proxy(this.ManageAddButton, this));
    
    // Manages the "remove item" button
    this.ManageRemoveButton = function() {
        // The "remove item" button is disabled if no item has been selected by the user
        this.removeItemButton.prop('disabled', this.selectedItem === null);
    };
    
    // Disable the "remove item" button at start
    this.ManageRemoveButton();
    
    this.HandleRemoveClick = function(event) {
        event.preventDefault();
        
        // Ensuring an item is selected
        if (this.selectedItem !== null) {
         
            // Update the cart display
            $('#selected_header').remove();
            // Remove the item from the list
            this.itemList.splice(this.selectedItem.index, 1);
            
            // Adjust the index of the following walks
            for (var i = this.selectedItem.index; i < this.itemList.length; ++i) {
                this.itemList[i].index = i;    
            }   
            
            // Reset the selection
            this.selectedItem = null;
        }      
        
        // Disable the remove button again
        this.ManageRemoveButton();
        
        this.ManageSubmitButton();
    };
    
    this.removeItemButton.on('click', $.proxy(this.HandleRemoveClick, this));
    
    this.HandleItemClick = function(event) {
        // If the targetted item isn't already selected
        if (event.target.id !== 'selected_header') {
            // If another item had already been selected
            $('#selected_header').removeAttr('id');
            
            var newTarget = $(event.target);
            
            // Identify as the selected item
            newTarget.attr('id', 'selected_header');
            
            // Assign the appropriate item as the selection
            this.selectedItem = this.itemList[newTarget.index()];// + this.currentPage * walksPerCartPage];
        }
        // Otherwise the clicked walk was already selected
        else {
            // It's unselected/unhighlighted
            $(event.target).removeAttr('id');   
            // Update the selection
            this.selectedItem = null;
        }
        
        // Update the "remove item" button
        this.ManageRemoveButton();
    };
    // Handles a click on one of the tabs
    this.HandleTabClick = function(event) {
     
        // If the clicked tab is the "walk" tab
        if (event.target.id === this.walkTab.attr('id')) {
            // Show the walk from
            this.walkForm.show();
            // Hide the petsit form
            this.petsitForm.hide();
        }
        // Otherwise if the clicked tab is the "petsit" tab
        else if (event.target.id === this.petsitTab.attr('id')) {
            // Hide the walk form
            this.walkForm.hide();
            // Show the petsit form
            this.petsitForm.show();   
        }
        // If the clicked tab is the "one-off walk" tab
        else if (event.target.id === this.singleWalkTab.attr('id')) {
            // Show the appropriate form
            $('#single_form').show();
            // Hide the unnecessary form
            $('#recurring_form').hide();
        }
        // Otherwise, if the clicked tab is the "recurring walk" tab
        else if (event.target.id === this.recurringWalkTab.attr('id')) {
            // Show the appropriate form
            $('#recurring_form').show();
            // Hide the unnecessary form
            $('#single_form').hide();
        } 
        // Pet stop
        else if (event.target.id === this.petStopTab.attr('id')) {
            $('#overnight_form').hide();
            $('#pet_stop_form').show();   
        }
        else {
            $('#pet_stop_form').hide();
            $('#overnight_form').show();   
        }
        this.ManageAddButton();
    };
    
    this.singleWalkTab.on('click', $.proxy(this.HandleTabClick, this));
    this.recurringWalkTab.on('click', $.proxy(this.HandleTabClick, this));
    this.walkTab.on('click', $.proxy(this.HandleTabClick, this));
    this.petsitTab.on('click', $.proxy(this.HandleTabClick, this));
    this.petStopTab.on('click', $.proxy(this.HandleTabClick, this));
    this.overnightTab.on('click', $.proxy(this.HandleTabClick, this));
    
    this.HandleSubmitClick = function(event) {
        event.preventDefault();  

        var orderInfo = new Array();
        
        orderInfo.push(this.itemList);
        orderInfo.push(this.customerName.val());
        orderInfo.push(this.customerInfo.val());
        orderInfo.push($('#order_comments').val());
        
        console.log(this.itemList);
        console.log(orderInfo);
        
        $.post('php/manageOrder.php', JSON.stringify(orderInfo), function(response) {
            $('#order_feedback').html($('html').attr('lang') === 'fr' ? 
                'Votre demande a été envoyée avec succès et nous y répondrons sous peu.' :
                'Your request has been successfully sent and we will answer it shortly.');
        });
        
    };
    
    this.submit.on('click', $.proxy(this.HandleSubmitClick, this));
    
    this.ManageSubmitButton = function() {
        //this.submit.attr('disabled', this.itemList.length === 0);
    };  
    
    // Displays the order currently kept in the session's memory
    this.DisplaySessionOrder = function() {
        $.get('php/getOrder.php', $.proxy(function(response) {
            // Parse the order
            
            var parsed = JSON.parse(response);
            
            if (parsed !== null) {
                
                var items = parsed.length;
                
                // Loop on the orders' items
                for (var i = 0; i < items; ++i) {
                    // Adjust the date back from its string representation
                    parsed[i].date = new Date(Date.parse(parsed[i].date));
                    
                    // Add the item to the cart
                    this.AddItemToCart(parsed[i]);
                }
                
                // Set the order as the current list of items
                this.itemList = parsed;   
            }
            }, this));   
    };
    
    //this.DisplaySessionOrder();
    this.ManageSubmitButton();
    
};