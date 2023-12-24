<?php

	session_start();
	
	if (isset($_SESSION['uid'])) {
		echo $_SESSION['uid'];	
	}
	else {
		echo -1;	
	}

?>