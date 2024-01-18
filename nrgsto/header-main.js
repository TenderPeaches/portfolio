var currentPage = document.getElementsByClassName("header__menu-link--current")[0];

currentPage.addEventListener('click', function(event) {	
    var otherPages = document.getElementsByClassName("header__menu-link");
	var shownPages = document.getElementsByClassName("header__menu-link--shown");

	if (shownPages.length == 0) {
		for (var i = 0; i < otherPages.length; ++i) {
			otherPages[i].classList.add("header__menu-link--shown");
		}
	} 
	else {
		for (var i = 0; i < otherPages.length; ++i) {
			otherPages[i].classList.remove("header__menu-link--shown");
		}
	}
});
