// All job-class divs are offers
var offers = document.getElementsByClassName('job');

// For each offer
for (var i = 0; i < offers.length; ++i) {
  // Listen to clicks
  offers[i].addEventListener('click', function(event) {

    // If the clicked job posting was already displaying its content
    if (event.target.getElementsByClassName('job__content--shown').length > 0) {
      // Remove the job posting's content
      event.target.getElementsByClassName('job__content--shown')[0].classList.remove('job__content--shown');
    }
    // Otherwise, the job posting's content was hidden when clicked
    else {
      // Any job posting that is already open will contain a div of class job__content--shown
      var shown = document.getElementsByClassName('job__content--shown');
      // While there is but a single open job posting
      while (shown.length > 0) {
        // Remove the --shown class from any of them (shouldn't be more than one)
        shown[0].classList.remove('job__content--shown');
      }
      // Show the content of whichever job posting has been just now selected by adding job__content--shown class
      event.target.getElementsByClassName('job__content')[0].classList.add('job__content--shown');
    }

  });
}
