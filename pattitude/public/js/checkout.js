var currentOrder = new function() {
    this.display = $('#order_display');
    
    this.loginTab = $('#login_tab');
    this.signupTab = $('#signup_tab');
    this.logout = $('#logout');
    
    this.username = $('#in_username');
    this.password = $('#in_password');
    this.passwordConfirm = $('#in_password_confirm');
    this.email = $('#in_email');
    
    this.passwordConfirmField = $('#password_confirm_field');
    this.emailField = $('#email_field');
    
    this.loginButton = $('#login');
    this.signupButton = $('#signup');
    
    this.HandleTabClick = function(event) {
        if (event.target.id == this.loginTab.attr('id')) {
            this.passwordConfirmField.hide();
            this.emailField.hide();
            this.loginButton.show();
            this.signupButton.hide();
        }  
        else {
            this.passwordConfirmField.show();
            this.emailField.show(); 
            this.loginButton.hide();
            this.signupButton.show();
        }
    };
    
    this.loginTab.on('click', $.proxy(this.HandleTabClick, this));
    this.signupTab.on('click', $.proxy(this.HandleTabClick, this));
    
    this.signup = function(event) {
        event.preventDefault();
        
        var signupData = {
            username: this.username.val(),
            password: this.password.val(),
            email: this.email.val()
            };  
            
        // Validate the signup data
        if (signupData.username.length == 0) {   
        }
        else if (signupData.password.length == 0) {
            
        }
        else if (signupData.password != this.passwordConfirm.val()) {
            
        }
        else if (signupData.email.length == 0) {
            
        }
        // Otherwise, all data is assumed valid
        else {
            $.post('php/signup.php', JSON.stringify(signupData), function(response) {
                if (response.indexOf('ERROR:  duplicate key value violates unique constraint "username_unique"') !== -1) {
                    console.log('User ' + signupData.username + ' already exists');
                }
                else if (response.indexOf('Signup successful') !== -1) {
                    console.log('Sign-up successful');
                }
                else {
                    console.log(response);    
                }
                
            });
        }
    };
    
    this.signupButton.on('click', $.proxy(this.signup, this));
    
    this.login = function(event) {
        event.preventDefault();
        
        // Collect login data
        var loginData = {
            username: this.username.val(),
            password: this.password.val()    
        };
        
        // POST the request
        $.post('php/login.php', JSON.stringify(loginData), function(response) {
            console.log('login.php' + response);
            // If login is successful, login.php returns a UID of 0 or higher
            if (response >= 0) {
                console('success!');   
            } 
        });
        
        
        this.DisplayLoginPrompt();
        
    };
    
    this.loginButton.on('click', $.proxy(this.login, this));
    
    this.PopulateDisplay = function() {
        
        var header;
        var format = function(date) {
            var formatted = new Date(date);
            return formatted.getDate() + '/' + formatted.getMonth() + '/' + formatted.getFullYear();
        };
        
        // Loop on the order's services
        for (var i = 0; i < this.order.length; ++i) {
            // If the service is a walk
            if (this.order[i].type === 'walk') {
                header = '<div class="order_header">' + format(this.order[i].date)  + ': ' + (this.order[i].duration === 'short' ? 'Courte ' : 'Longue ') +
                    ' marche entre ' + this.order[i].earlyTime + 'h00 et ' + this.order[i].lateTime + 'h00</div>';
                this.display.append(header);
                console.log(header);  
            }
            // Otherwise, the service is a house stay
            else {
                header = '<div class="order_header">De ' + this.order[i].startTime + 'h00 le ' + this.order[i].startDate + 
                ' à ' + this.order[i].endTime + 'h00 le ' + this.order[i].endDate + '</div>';
                this.display.append(header);    
            }
        }
    };
    
    this.LoadSessionOrder = function() {
        
        $.get('php/getOrder.php', $.proxy(function(response) {
            try {
                this.order = JSON.parse(response);
                this.PopulateDisplay();
            } 
            catch (e) {   
            }
        }, this));
    };
    
    this.LoadSessionOrder();    
    
    this.DisplayLoginPrompt = function() {
        $.get('php/getUID.php', $.proxy(function(response) {
            
            // If UID is above -1, the user has logged in for this session
            if (response > -1) {
                // Hide the login prompt
                $('#sign_in_form').hide();
                // Show the disconnect option
                this.logout.show();
                this.logout.css('display', 'inline-block');
            }    
            // Otherwise, the user has not logged in
            else {
                // Show the login prompt
                $('#sign_in_form').show();
                // Hide the disconnect option
                this.logout.hide();   
            }
        }, this));
    };
    
    this.DisplayLoginPrompt();
    
    this.Logout = function() {
        $.post('php/logout.php', $.proxy(function() {
            this.DisplayLoginPrompt();
            }, this));      
    };
    
    this.logout.on('click', $.proxy(this.Logout, this));
    
};