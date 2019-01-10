<?php

	header('Content-Type: application/json');
	require "..\Includes\QuickTicketApi.php";
	require "..\Includes\Connection.php";

	//Verifies the Id inserted into the program

	$fourfour = $_GET['four'];

	$conn = new Connection('DB-NAME');
	$quick = new QuickTicketApi($conn);

	if((time() - $conn->getTimeTest()) > 1170){
		$token = $quick->requestToken();
		$conn->upTokenTest($token,time());
	}
	else{
		$token = $conn->tokenGrab(30);
	}

	$returnFour = $quick->getFullNameFromFourByFour($fourfour,$token);

	if($returnFour == "Guest User"){
		echo "FALSE";
	}
	else{
		echo "TRUE";
	}

?>
