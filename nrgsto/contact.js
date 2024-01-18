// Fetch query parameters
var params = new URLSearchParams(window.location.search);
var sent = params.get("sent");

if (sent == 'true') {
	var confirmation = document.getElementsByClassName("contact-form__submit-confirmation")[0];

	confirmation.classList.add("contact-form__submit-confirmation--visible");
}

