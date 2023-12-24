<?php

	// TODO - limit number of emails that can be sent

	// Fetch input
	$data = file_get_contents("php://input");

	// Decode the JSON-encoded input
	$json = json_decode($data, true);

	session_start();

	// Set the current order array, if it doesn't yet exist
	if (isset($_SESSION['currentOrder'])) {
		$_SESSION['currentOrder'] = array();
	}

	$message = '';

	// Loop on each element of the data which represents individual services ordered by a customer
	foreach($json[0] as $service) {


		$_SESSION['currentOrder'][count($_SESSION['currentOrder'])] = $service;

		$message .= '\r\n' . implode(' / ', $service);
	};

	// Append the customer's name, info and comments
	$message .= '\r\n' . $json[1] . '\r\n' . $json[2] . '\r\n' . $json[3];

	mail('info@pattitude.ca', 'Commande internet', $message);

?>
