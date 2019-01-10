<?php
	header('Content-type: application/json');
	require "..\Includes\Connection.php";
	$conn = new Connection('DB_NAME');

	/*
		Created to gather the buildings from the database
		
	*/
	
	//get count of buildings
	$sql = "SELECT COUNT(building_name) FROM dbo.buildings;";
	$params = array();
	$result = $conn->runSql($params,$sql);
	$count = sqlsrv_fetch_array($result)[0];
	
	//select distinct buildings from the count given in the buildings
	$sql = "SELECT DISTINCT building_name FROM dbo.buildings;";
	$getter = $_GET['get'];
	$params = array($getter);
	$result = $conn->runSql($params,$sql);
	
	
	$buildings = array();
	for ($i = 0; $i < $count; $i++){
		$res = sqlsrv_fetch_array($result);
		$prepare = $res["building_name"]; 
		$buildings[$i] = "$prepare";
	}
	//var_dump($buildings);
	echo json_encode($buildings);
?>
