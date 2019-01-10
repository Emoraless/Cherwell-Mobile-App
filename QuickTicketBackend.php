<?php
	header('Content-type: application/json');

	require "..\Includes\Connection.php";
	require "..\Includes\QuickTicketApi.php";

	ini_set('display_errors',1);
	ini_set('display_startup_errors',1);
	error_reporting(-1);


	/**

	Authors: Scott Kannawin, Eric Rhodes, Eric Morales
	Owner: Services Studio

	This is the back end to the quick ticket app. Used to gather and organize data from whatever source
	as well as send it to the quick ticket api to send a ticket.

	*/

	$phone = "";
	$email = "";
	$buildingFull= "";
	$buildingCode= ""; //should be a method to grab this from the full name
						//need to port the building list to the database
	$roomNumber = "";
	$loggedIn = '';
	if(isset($_GET['user'])){
		if(isset($_GET['building'])) $location = $_GET['building'];
		if(isset($_GET['roomNumber'])) $incOrigin = $_GET['roomNumber'];
		$fourfour = $_GET['user'];
		$long = $_GET['long'];
		$service = $_GET['service'];
		$category = $_GET['category'];
		$subcategory = $_GET['sub'];
		$short = $_GET['shorty'];
		$teamAssign = $_GET['teamAssign'];
		$loggedIn = $_GET['userIn'];
		if($loggedIn == "none"){
			$loggedIn = "";
		}
		if(isset($_GET['phone'])) $phone = $_GET['phone'];
		if(isset($_GET['email'])) $email = $_GET['email'];
		if(isset($_GET['buildingFull'])) $buildingFull = $_GET['buildingFull'];
		if(isset($_GET['roomNumber'])) $roomNumber = $_GET['roomNumber'];
	}


	$conn = new Connection('DB-NAME');
	$quick = new quickTicketAPI($conn);

	$buildingCode = $quick->getBuildingCode($buildingFull);
	if(!isset($buildingCode)) $buildingCode = "";

	//change these values from the test side to the real side when in production
	if((time() - $conn->getTimeTest()) > 1170){

		$token = $quick->requestToken();
		$conn->upTokenTest($token,time());
	}
	else{
		$token = $conn->tokenGrab(30);
	}
	if($teamAssign == 'na') {
		$teamAssign = $quick->getTeamAssignment($loggedIn, $token);
	}
		$name = $quick->getFullNameFromFourByFour($fourfour, $token);
		if($loggedIn != "") {
				$loggedIn = $quick->getFullNameFromFourByFour($loggedIn,$token);
		}
		$values = array(
			$name,
			$short,
			$long,
			$teamAssign,
			$buildingFull,
			$roomNumber,
			$buildingCode,
			$phone,
			$email,
			$service,
			$category,
			$subcategory,
			$loggedIn
		);

		$data = $quick->getData($values);

		echo $quick->submitTicket($data, $token);
	//}
	//else echo "Too many attempts too fast";


	//gets the IP address of whoever is accessing this. To be used if the ticket has been submitted too often.
	function getIp(){
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) {$q = $_SERVER['HTTP_CLIENT_IP'];}
		elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {$q = $_SERVER['HTTP_X_FORWARDED_FOR'];}
        else {$q = $_SERVER['REMOTE_ADDR'];}
		return $q;
	}

?>
