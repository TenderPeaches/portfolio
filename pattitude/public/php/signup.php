<?php
	// Registers a user in the database, saving its username, password and email
	// Needs to be activated once contat starts being output regularly

	// Fetch the content of the POST request
	$request = file_get_contents("php://input");

	// Decyphering the user data
	// Fetch username, located before the password tag
	$user = substr($request, strpos($request, '"username":"') + 12, strpos($request, '","password":') - (strpos($request, '"username":') + 12));
	// Fetch the password
	$pw = substr($request, strpos($request, '","password":"') + 14, strpos($request, '","email":') - (strpos($request, '","password":"') + 14));
	// Fetch the email
	$email = substr($request, strpos($request, '","email":"') + 11, strlen($request) - (strpos($request, '","email":"') + 13));

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

	// Prepare the user's signup information INSERT into the database
	$result = pg_prepare($db_connect, 'query_name_here', "INSERT INTO bdns.user_signup_info (username, password, join_date, email) VALUES ('$user', '" . hash('sha256', $pw) . "', '" . date('m-d-y') . "', '$email');");

	// Execute the insertion SQL query
	$result = pg_execute($db_connect, 'query_name_here', array()) or die (pg_last_error());

	pg_free_result($result);

	// If at least one row has been modified by the insertion
	if (pg_affected_rows($result) > 0) {

		// Fetch the user ID
		$result = pg_prepare($db_connect, 'get_user_id', "SELECT id FROM bdns.user_login_info WHERE username = $1");

		// Execute the query
		$result = pg_execute($db_connect, 'get_user_id', array($user))
			or die('Database ID request error: ' . pg_last_error());

		// Implicitely login the user after a successful signup
		session_start();

		// Fetch the corresponding database user
		$row = pg_fetch_row($result, 0);

		// Save the corresponding user ID to the user's session
		$_SESSION['uid'] = $row[0];

		// Free the result set
		pg_free_result($result);
	}

	// Close the connection
	pg_close($db_connect);

?>
