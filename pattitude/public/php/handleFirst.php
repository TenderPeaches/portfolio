<?php

	$input = file_get_contents('php://input');

	$message = wordwrap($input, 70, "\r\n");

	mail('info@pattitude.ca', 'Demande de rencontre', $message);

	echo 'sure';

?>
