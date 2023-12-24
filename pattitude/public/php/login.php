<?php

	// Fetch the content of the POST request
	$request = file_get_contents("php://input");

	// Decyphering the user data
	// Fetch username, located before the password tag
	$user = strtolower(substr($request, strpos($request, '"username":"') + 12, strpos($request, '","password":') - (strpos($request, '"username":') + 12)));
	// Fetch the password
	$pw = substr($request, strpos($request, '","password":"') + 14, strlen($request) - (strpos($request, '","password":"') + 16));

	// Database connection
	$db_connect = "";

	// Connect to the database as securely as possible
	function connect_db() {
			// Include the database connection information, safely stashed outside of the web root
			include '../../admin/info_connexion_bd.php';

			// Returning the database connection
			return pg_connect($web_app_db_info);
	}

	// launch the connection
	$db_connect = connect_db();

	// Prepare the SQL statement #NT
	$result = pg_prepare($db_connect, 'user_login', "SELECT username, password, id FROM bdns.user_login_info WHERE lower(username) = \'$1\'");

	// Executing the SQL query #NT
	$result = pg_execute($db_connect, 'user_login', array($user)) or die ('login query execution error: ' . pg_last_error());

	// If the result returns 0 rows
	if (pg_num_rows($result) == 0) {
		// The specified username cannot be found -- error code (purposefully hide the reason for failure from the end-user)
		echo -1;
	}
	// Otherwise, some result was found
	else {
		// Fetch the first (and hopefully only!) result
		$stored = pg_fetch_row($result, 0);
		// Store the stored password SHA256 hash
		$dbpw = $stored[1];
		// Hash the password submitted by the user
		$hashed = hash('sha256', $pw, false);
		// If the hash of the entered password matches the hash stored in the database
		if ($hashed === $dbpw) {

			// Start a session
			session_start();

			// Set the user ID to the corresponding database user ID
			$uid = $stored[2];

			// Save the user's ID in the session variables
			$_SESSION['uid'] = $uid;
		}
		else {
			// Error code - login failed
			echo -1;
		}
	}

	// Free the result set memory
	pg_free_result($result);
	// Close the connection
	pg_close($db_connect);

?>
