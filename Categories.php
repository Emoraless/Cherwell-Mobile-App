<?php

	header('Content-type: application/json');
	require "..\Includes\Connection.php";
	$conn = new Connection(DB-NAME');
	
	/**
		Used in the quick ticket app to get the category selection for creating a ticket
	
	
	
	*/
	
	
		
	$categoryType = $_GET['type'];
	
	//gets the service impacted
	if($categoryType == 1){
		$sql = "SELECT COUNT(DISTINCT Service) FROM dbo.Categories;";
		$result = $conn->runUpdate($sql);
		$count = sqlsrv_fetch_array($result)[0];
		
		$sql = "SELECT DISTINCT Service FROM dbo.Categories;";
		$result = $conn-> runUpdate($sql);
		
		$service= array();
		for($i = 0; $i < $count; $i++){
			$res = sqlsrv_fetch_array($result);
			$string_prepare = $res['Service'];
			$service[$i] = $string_prepare;
		}
		
		echo json_encode($service);
	}
	//gets the category type for the ticket
	else if($categoryType == 2 && isset($_GET['affected'])){
		$service = $_GET['affected'];
		$sql = "SELECT COUNT(DISTINCT Category) FROM dbo.Categories WHERE Service = '".$service."';";
		$result = $conn->runUpdate($sql);
		$count = sqlsrv_fetch_array($result)[0];
		$sql = "SELECT DISTINCT Category FROM dbo.Categories WHERE Service = '".$service."';";
		$result = $conn->runUpdate($sql);
		
		$cat = array();
		for($i = 0; $i < $count; $i++){
			$res = sqlsrv_fetch_array($result);
			$string_prepare = $res['Category'];
			$cat[$i] = $string_prepare;
		}
		
		echo json_encode($cat);
	}
	//gets the subcategory for the title
	else if($categoryType == 3 && isset($_GET['affected']) && isset($_GET['category'])){
		$service = $_GET['affected'];
		$category = $_GET['category'];
		$sql = "SELECT COUNT(DISTINCT Subcategory) FROM dbo.Categories WHERE Service = '".$service."' AND Category = '".$category."';";
		$result = $conn->runUpdate($sql);
		$count = sqlsrv_fetch_array($result)[0];
		
		$sql = "SELECT DISTINCT Subcategory FROM dbo.Categories WHERE Service = '".$service."' AND Category = '".$category."';";
		$result = $conn->runUpdate($sql);
		
		$cat = array();
		for($i = 0; $i<$count;$i++){
			$res = sqlsrv_fetch_array($result);
			$string_prepare = $res['Subcategory'];
			$cat[$i] = $string_prepare;
		}
		
		echo json_encode($cat);
	}


?>
