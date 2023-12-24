<?php

	// Fetch the data from the POST request
	parse_str(file_get_contents("php://input"), $post);

	// Include connection information, stashed outside of the web root
	include '../../info_connexion_db.php';

	// Setting the database connection
	$db_connect = pg_connect($web_app_db_info)
		or die ("Connection to database failed : " . pg_last_error());

	$query = "SELECT ";

	// Executing the SQL query
	$result = pg_query($query)
		or die("SQL query error: " . pg_last_error());

	$query = "INSERT INTO ";

		// Executing the SQL query
	$result = pg_query($query)
		or die("SQL query error: " . pg_last_error());

	echo pg_affected_rows($result);

		// Free the result set
	pg_free_result($result);

	// Close the DB connection
	pg_close($db_connect);

?>
