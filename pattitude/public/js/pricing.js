var pricingTable = new function() {

    this.zoneOutput = $('#out_zone');
    this.submit = $('#submit_zone');
    this.postalShort = $('#in_postal_short');
    this.zone = -1;

    this.dogCount = $('#dog_count input[type=radio][name=dog_count]');
    this.zoneOutput.hide();
    this.submit.on('click', $.proxy(function() {
      var code = this.postalShort.val().substring(0, 3);
      var zone;

      /*
        Zone changes :
        12-08-2018
        x H2L: 0 > 1
        x H2P: 0 > 1
        x H5A: 1 > 2
        x H1Y: 1 > 0
        x H1X: 1 > 0
        x H2A: 1 > 0
        x H1W: 2 > 1
        x +H2W: 1
        x +H3N: 1
        x H1T: 2>1
        x +H1S: 2
        x +H1Z, +H1R: 2
        x +H1P, H1H: 3
        x H2C, H3L: 2>3
        x -H4J, -H4L, -H3X, -H3M
        x H3R: 2>3
        x H3B, H2Y, H2Z, H5B, H2M: 1>2
      */

      // Matches the following :
      // H1Y H1X H2A H2S H2G H2H H2J H2K H2T H2R H2E H3N
      if (/^[hH](1[yYxX]|2[aAsSgGhHjJkKtTrReE]|3[nN])$/.test(code)) {
          zone = 0;
      }
      // H4Z H3A H3N H2V H2W H2X H1T H1W
      else if (/^[hH](4[zZ]|3[aAnN]|2[lLpPvVwWxX]|1[tTwW])$/.test(code)) {
          zone = 1;
      }
      // H1R H1S H1V H2B H2M H2N H2Y H2Z H3B H3G H3H H3P H3S H3T H3V H5A H5B
      else if (/^[hH](1[rRsSvV]|2[bBmMnNyYzZ]|3[bBgGhHpPsStTvV]|5[aAbB])$/.test(code)) {
          zone = 2;
      }
      // H1H H1M H1N H1P H2C H3C H3J H3L H3R H3W H3X H3Y H3Z H4A H4N
      else if (/^[hH](1[hHmMnNpP]|2[cC]|3[cCjJlLrRwWyYzZ]|4[aAnN])$/.test(code)) {
          zone = 3;
      }
      else {
          zone = 4;
      }

          console.log(zone + ' ' + this.zone);
      if (zone !== this.zone && this.zone !== -1) {
          $('.selected, .selected_header').removeAttr('class');
      }

      this.zone = zone;

      this.zoneOutput.show();
      // French output
      if ($('html').attr('lang') === 'fr') {
      this.zoneOutput.html(this.zone < 4 ? 'Vous êtes situés dans la zone ' + this.zone : 'Vous êtes situés à l\'extérieur de notre aire de service. Contactez-nous pour vérifier si un arrangement peut être fait.');
      }
      // English output
      else {
          this.zoneOutput.html(this.zone < 4 ? 'You are located in zone ' + this.zone : 'You are located outside our serviced area. Contact us to verify if an arrangement can be made.');
      }

      // Color-aid the corresponding column

      if (this.zone < 4) {
          var cell;
          // This local variable now contains the zone + 2 to target the appropriate column
          zone = this.zone + 2;
          // Highlight all the data cells corresponding to the appropriate zone
          $('.pricing_table tr td:nth-child(' + zone + ')').each(function (index) {
            pricingTable.Select($(this));
          });
      }

    }, this));

    // Adjust the prices according to the number of dogs
    this.AdjustDogCount = function(event) {
        var out = pricingTable.OutputPrice;
        // If 1 dog is selected (default)
        if (pricingTable.dogCount.filter(':checked').val() == "1") {
            // Set the prices

            // Short walks
            $('#row_short > td:nth-child(2)').html(out(20));
            $('#row_short > td:nth-child(3)').html(out(24));
            $('#row_short > td:nth-child(4)').html(out(28));
            $('#row_short > td:nth-child(5)').html(out(32));

            // Long walks
            $('#row_long > td:nth-child(2)').html(out(25));
            $('#row_long > td:nth-child(3)').html(out(30));
            $('#row_long > td:nth-child(4)').html(out(35));
            $('#row_long > td:nth-child(5)').html(out(40));

            // 90-minute walks
            $('#row_90m > td:nth-child(2)').html(out(32));
            $('#row_90m > td:nth-child(3)').html(out(38));
            $('#row_90m > td:nth-child(4)').html(out(44));
            $('#row_90m > td:nth-child(5)').html(out(50));

            // Couverture Complète
            $('#row_full_walks > td:nth-child(2)').html(out(50) + " - " + out(75));
            $('#row_full_walks > td:nth-child(3)').html(out(72) + " - " + out(90));
            $('#row_full_walks > td:nth-child(4)').html(out(84) + " - " + out(105));
            $('#row_full_walks > td:nth-child(5)').html(out(96) + " - " + out(120));

            // Nuitée à domicile
            $('#row_night > td:nth-child(2)').html(out(40));
            $('#row_night > td:nth-child(3)').html(out(50));
            $('#row_night > td:nth-child(4)').html(out(60));
            $('#row_night > td:nth-child(5)').html(out(80));

            // Nuitée complète
            $('#row_night_package > td:nth-child(2)').html(out(72));
            $('#row_night_package > td:nth-child(3)').html(out(84));
            $('#row_night_package > td:nth-child(4)').html(out(100));
            $('#row_night_package > td:nth-child(5)').html(out(120));

            // Courte course
            $('#row_run_short > td:nth-child(2)').html(out(35));
            $('#row_run_short > td:nth-child(3)').html(out(40));
            $('#row_run_short > td:nth-child(4)').html(out(45));
            $('#row_run_short > td:nth-child(5)').html(out(50));

            // Longue course
            $('#row_run_long > td:nth-child(2)').html(out(55));
            $('#row_run_long > td:nth-child(3)').html(out(60));
            $('#row_run_long > td:nth-child(4)').html(out(65));
            $('#row_run_long > td:nth-child(5)').html(out(70));

            // Course montagne
            $('#row_run_mountain > td:nth-child(2)').html(out(75));
            $('#row_run_mountain > td:nth-child(3)').html(out(75));
            $('#row_run_mountain > td:nth-child(4)').html(out(75));
            $('#row_run_mountain > td:nth-child(5)').html(out(75));
        }
        // If 2 dogs are selected (the only available value aside from the default value)
        else {
            // Short walks
            $('#row_short > td:nth-child(2)').html(out(25));
            $('#row_short > td:nth-child(3)').html(out(29));
            $('#row_short > td:nth-child(4)').html(out(33));
            $('#row_short > td:nth-child(5)').html(out(37));

            // Long walks
            $('#row_long > td:nth-child(2)').html(out(35));
            $('#row_long > td:nth-child(3)').html(out(40));
            $('#row_long > td:nth-child(4)').html(out(45));
            $('#row_long > td:nth-child(5)').html(out(50));

            // 90-minute walks
            $('#row_90m > td:nth-child(2)').html(out(47));
            $('#row_90m > td:nth-child(3)').html(out(53));
            $('#row_90m > td:nth-child(4)').html(out(59));
            $('#row_90m > td:nth-child(5)').html(out(65));

            // Couverture Complète
            $('#row_full_walks > td:nth-child(2)').html(out(60) + " - " + out(90));
            $('#row_full_walks > td:nth-child(3)').html(out(85) + " - " + out(105));
            $('#row_full_walks > td:nth-child(4)').html(out(100) + " - " + out(120));
            $('#row_full_walks > td:nth-child(5)').html(out(120) + " - " + out(140));

            // Nuitée à domicile
            $('#row_night > td:nth-child(2)').html(out(50));
            $('#row_night > td:nth-child(3)').html(out(60));
            $('#row_night > td:nth-child(4)').html(out(70));
            $('#row_night > td:nth-child(5)').html(out(80));

            // Nuitée complète
            $('#row_night_package > td:nth-child(2)').html(out(90));
            $('#row_night_package > td:nth-child(3)').html(out(108));
            $('#row_night_package > td:nth-child(4)').html(out(126));
            $('#row_night_package > td:nth-child(5)').html(out(150));

            // Courte course
            $('#row_run_short > td:nth-child(2)').html(out(45));
            $('#row_run_short > td:nth-child(3)').html(out(50));
            $('#row_run_short > td:nth-child(4)').html(out(55));
            $('#row_run_short > td:nth-child(5)').html(out(60));

            // Longue course
            $('#row_run_long > td:nth-child(2)').html(out(75));
            $('#row_run_long > td:nth-child(3)').html(out(80));
            $('#row_run_long > td:nth-child(4)').html(out(85));
            $('#row_run_long > td:nth-child(5)').html(out(90));

            // Course montagne
            $('#row_run_mountain > td:nth-child(2)').html(out(100));
            $('#row_run_mountain > td:nth-child(3)').html(out(100));
            $('#row_run_mountain > td:nth-child(4)').html(out(100));
            $('#row_run_mountain > td:nth-child(5)').html(out(100));
        }
    };
    this.dogCount.on('change', this.AdjustDogCount);

    this.Select = function(cell) {
        cell.attr('class', 'selected');
    };

    // Outputs a price according to the appropriate linguistic format
    this.OutputPrice = function(price) {
        // If french output is requested
        if ($('html').attr('lang') === 'fr') {
            return price + ",00$";
        }
        // Otherwise, english output is implicitely requested
        else {
            return "$" + price + ".00";
        }
    };
};
