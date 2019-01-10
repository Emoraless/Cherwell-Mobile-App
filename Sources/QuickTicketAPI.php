<?php

/*
	@Authors: Scott Kannawin, Eric Rhodes, Eric Morales
	@Owner: OU IT Services Studio

	This is the API used for quickticket, all functions within this are used to some degree for ticket
	creation and organizing the data to create a ticket. Currently the system can submit any type of ticket
	that is not a straightup hardware check in (that is pending investigation to whether it is possible
	through not creating a custom solution in the cherwell app itself)
	Express check-in's though have their own ticket creation process as well, since it is a more verbose
	process to go through


*/

class quickTicketAPI{

	//constructs the class using the connection given to it so it can then use the database given.
	function __construct($conn){
		$this->conn = $conn;
	}


	//function to encode time, sets to two days in advanced
	function getFutureTime($minutesAhead = (60*24*2)) {
		return date('n/j/Y g:i A', strtotime("+$minutesAhead minutes"));
	}

	//checks the cherwell system if the 4x4 is currently there. if it is, it will return the full name associated
	//this is used for validation on techs, as well as inputing the customers name
	function getFullNameFromFourByFour($fourByFour, $token) {
		$url = 'CHERWELL-URL';
		$headers = array(
			"Authorization: Bearer $token",
			"Content-Type: application/json"
		);
		$data = array(  # Customer - Internal
			'busObId'           => $this->conn->tokenGrab(x),
			'includeAllFields'  => FALSE,
			'filters'           => array(
				array(  # Customer.SAMAccountName
					'fieldId'   => $this->conn->tokenGrab(x),
					'operator'  => 'eq',
					'value'     => $fourByFour
				)
			)
		);
		$data_string = json_encode($data);

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		$results = json_decode(curl_exec($ch), TRUE);
		if (isset($results['totalRows']) && $results['totalRows'] === 1) {
			$customerDisplayName = $results['businessObjects'][0]['busObPublicId'];
		} else {
			$customerDisplayName = 'Guest User';
		}

		return $customerDisplayName;
	}

	function getTeamAssignment($fourByFour, $token) {
		$url = "CHERWELL_URL";
		$headers = array(
			"Authorization: Bearer $token",
			"Content-Type: application/json"
		);

		$data = array(  # Customer - Internal
			'busObId'           => "ID",
			'includeAllFields'  => FALSE,
			'fields'						=> 'FIELD_ID',
			'filters'           => array(
				array(  # Customer.SAMAccountName
					'fieldId'   => 'FIELD_ID',
					'operator'  => 'eq',
					'value'     => "Sooner\\" . $fourByFour
				)
			)
		);
		$data_string = json_encode($data);

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		$results = json_decode(curl_exec($ch), TRUE);

		if (isset($results['totalRows']) && $results['totalRows'] === 1) {
			$team = $results['businessObjects'][0]['fields'][3]['value'];
		}

		return $team;
	}

	//given the building name find the building code from the database
	function getBuildingCode($building){
		$sql = "SELECT building_code FROM dbo.buildings WHERE building_name = '$building';";
		$params = array();
		$request = $this->conn->runSql($params,$sql);

		$res = sqlsrv_fetch_array($request)['building_code'];
		return $res;
	}


	//submits the request to make a ticket
	function submitTicket($data, $token){
		$url = $this->conn->tokenGrab(x);
		$headers = array(
			"Authorization: Bearer $token",
			"Content-Type: application/json"
		);
		$data_string = json_encode($data);
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		$results = curl_exec($ch);

		return $results;
	}

	//sets the ticket to resolved
	function setTicketAsResolved($data, $token){
		$url = 'CHERWELL_URL';
		$headers = array(
			"Authorization: Bearer $token",
			"Content-Type: application/json"
		);
		$data_string = json_encode($data);
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		$results = curl_exec($ch)

		return $results;
	}

	//used to create the string to be inputed into the description field of the ticket
	function parseDescription($data, $token){
		$desc = "EXPRESS CHECK IN <br /><br />----Point of Contact (IT Specialist)----<br />";
		$desc = $desc . "POC_OUNetID: " . $data[0] . "<br />";
		$desc = $desc . "POC_Name: " . $this->getFullNameFromFourByFour($data[0], $token) . "<br />";
		$desc = $desc . "POC_Phone: " . $data[1] . "<br />";
		$desc = $desc . "POC_Email: " . $data[2] . "<br /><br />----Affected User----<br />";
		$desc = $desc . "Affect_OUNetID: " . $data[3] . "<br />";
		$desc = $desc . "Affect_Phone: " . $data[4] . "<br /><br />----Computer----<br />";
		$desc = $desc . "Type: " . $data[5] . "<br />";
		$desc = $desc . "Make: " . $data[6] . "<br />";
		$desc = $desc . "Serial: " . $data[7] . "<br />";
		$desc = $desc . "Backup: " . $data[8] . "<br /><br />";
		$desc = $desc . "Pickup_Location: " . $data[9] . "<br />";
		$desc = $desc . "Pickup_Room: " . $data[10] . "<br />";
		$desc = $desc . "Delivery_Location: " . $data[11] . "<br />";
		$desc = $desc . "Delivery_Room: " . $data[12] . "<br /><br />";
		$desc = $desc . "Description: " . $data[13];

		$data[13] = $desc;
		return $data;
	}

	function getDataResolve($values){
		$data = array(  # Incident
			'busObId'           => $this->conn->tokenGrab(x),
			'includeAllFields'  => TRUE,
			'fields'            => array(
				array( # email
					'fieldId' 	=> 'FIELD_ID',
					'value' 	=> 'Resolved',
					'dirty' 	=> TRUE
				)
			)
		);

		return $data;
	}

	//display name
	//short description
	//long description
	//service
	//category
	//subcategory
	//call souce (should be one preset one)
	//check-in location (for walk ins and hardware check ins only)
	//review by (use the method)
	//owned by team (only method that can be used, cannot assigned to specific person)
	//building full
	//room number
	//location code (should be obtained dynamically from a list of tables)
	//phone
	//email
	function getData($values){
		$data = array(  # Incident
			'busObId'           => $this->conn->tokenGrab(x),
			'includeAllFields'  => TRUE,
			'fields'            => array(
				array(  # Incident.Customer Display Name
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[0],
					'dirty'     => TRUE
				),
				array(  # Incident.Short Description
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[1],
					'dirty'     => TRUE
				),
				array(  # Incident.Description
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[2],
					'dirty'     => TRUE
				),
				array(  # Incident.Service
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[9],
					'dirty'     => TRUE
				),
				array(  # Incident.Category
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[10],
					'dirty'     => TRUE
				),
				array(  # Incident.Subcategory
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[11],
					'dirty'     => TRUE
				),
				array(  # Incident.Call Source
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => 'Mobile',
					'dirty'     => TRUE
				),
				array(  # Incident.Check-In Location
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => 'Engineering Lab',
					'dirty'     => TRUE
				),
				array(  # Incident.Review By Deadline
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $this->getFutureTime(),
					'dirty'     => TRUE
				),
				array(  # Incident.Owned By Team
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[3],
					'dirty'     => TRUE
				),
				array(	# Incident.Owned By User
					'fieldId' 	=> 'FIELD_ID',
					'value'		=> $values[12],
					'dirty'		=> TRUE
				),
				array(	# building.full name
					'fieldId'	=> $this->conn->tokenGrab(x),
					'value'		=> $values[4],
					'dirty'		=> TRUE
				),
				array(  # Room number
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[5],
					'dirty'     => TRUE
				),
				array(  # Location code
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[6],
					'dirty'     => TRUE
				),
				array(  # Phone number
					'fieldId'   => 'FIELD_ID',
					'value'     => $values[7],
					'dirty'     => TRUE
				),
				array( # email
					'fieldId' 	=> 'FIELD_ID',
					'value' 	=> $values[8],
					'dirty' 	=> TRUE
				)
			)
		);

		return $data;
	}

	//DATA ARRAY FOR EXPRESS CHECK IN
	//display name
	//short description
	//long description
	//service
	//category
	//subcategory
	//call souce (should be one preset one)
	//check-in location (for walk ins and hardware check ins only)
	//review by (use the method)
	//owned by team (only method that can be used, cannot assigned to specific person)
	//building full
	//room number
	//location code (should be obtained dynamically from a list of tables)
	//phone
	//email
	function getExpressData($values){
		$data = array(  # Incident
			'busObId'           => $this->conn->tokenGrab(x),
			'includeAllFields'  => TRUE,
			'fields'            => array(
				array(  # Incident.Customer Display Name
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[0],
					'dirty'     => TRUE
				),
				array(  # Incident.Short Description
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => 'EXPRESS CHECK IN',
					'dirty'     => TRUE
				),
				array(  # Incident.Description
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[13],
					'dirty'     => TRUE
				),
				array(  # Incident.Service
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => "Device Support",
					'dirty'     => TRUE
				),
				array(  # Incident.Category
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => "Partnership On-Site Support",
					'dirty'     => TRUE
				),
				array(  # Incident.Subcategory
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => "Express Check-In",
					'dirty'     => TRUE
				),
				array(  # Incident.Call Source
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => 'Service Catalog',
					'dirty'     => TRUE
				),
				array(  # Incident.Check-In Location
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => 'Engineering Lab',
					'dirty'     => TRUE
				),
				array(  # Incident.Review By Deadline
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $this->getFutureTime(),
					'dirty'     => TRUE
				),
				array(  # Incident.Owned By Team
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => "Services",
					'dirty'     => TRUE
				),
				array(	# building.full name
					'fieldId'	=> $this->conn->tokenGrab(x),
					'value'		=> $values[11],
					'dirty'		=> TRUE
				),
				array(  # Room number
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $values[12],
					'dirty'     => TRUE
				),
				array(  # Location code
					'fieldId'   => $this->conn->tokenGrab(x),
					'value'     => $this->getBuildingCode($values[11]),
					'dirty'     => TRUE
				),
				array(  # Phone number
					'fieldId'   => 'FIELD_ID',
					'value'     => $values[4],
					'dirty'     => TRUE
				)
			)
		);

		return $data;
	}

	//request token when it is time
	function requestToken() {
		$conn = new Connection('DB_NAME');

		//instantiate login information, api_key, username, and password
		$api = $this->conn->tokenGrab(x);
		$user = $this->conn->tokenGrab(x);
		$pass = $this->conn->tokenGrab(x);

		//echo $api;
		//echo $user;
		//echo $pass;

		//build fields to send to the token giver
		$fields = array(
			'grant_type' 	=> urlencode('password')
			, 'client_id'  	=> urlencode($api)
			, 'username'   	=> urlencode($user)
			, 'password'	=> urlencode($pass));

		$fields_string = '';
		foreach ($fields as $key=>$value) { $fields_string .= $key . '=' . $value . '&'; }
		rtrim($fields_string, '&');

		//send the request to token giver via cURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'CHERWELL-URL');
		curl_setopt($ch, CURLOPT_POST, count($fields));
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			  'Content-Type'   => urlencode('application/x-www-form-urlencoded')
			, 'Content-Length' => urlencode(strlen($fields_string))
		));

		$cherwellApiResponse = json_decode(curl_exec($ch), TRUE);
		return $cherwellApiResponse['access_token'];
	}

}
?>
