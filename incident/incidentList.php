<?php

//
require ".\Includes\Connection.php";
require ".\Includes\QuickTicketAPI.php";

//Name
$id = $_GET["id"];

$conn = new Connection('slackdb');
$quick = new quickTicketAPI($conn);

$token = $quick->requestToken();
//Gets the full name
$full = $quick->getFullNameFromFourByFour($id, $token);

$headers = array(
  "Authorization: Bearer $token",
  "Content-Type: application/json"
);
//Sets array of headers
$fields = array(
  'busObId' 	=> 'ID',
  'includeAllFields' 	=> FALSE,
  'fields' 	=> array(
    "ID",                       //incident number
    "ID",                       //status
    "ID",                       //created time and date
    "ID",             //short description
    //"ID"                      //long description
  ),
  'filters' => array(
    array(
      'fieldId' => 'ID,
      'operator' => 'eq',
      'value' => ''
    ),
    array(
      'fieldId' => 'ID',
      'operator' => 'eq',
      'value' => $full
      )
    )
  );

$fieldsJSON = json_encode($fields);

$ch = curl_init('URL');
      curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
      curl_setopt($ch, CURLOPT_POSTFIELDS, $fieldsJSON);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);

//Gets the response
$cherwellApiResponse = json_decode($result, TRUE);

#if request not empty, interpret
$totalRows = $cherwellApiResponse['totalRows'];

$info = array();
for($i = 0; $i < $totalRows; $i++)
{
  $status = $cherwellApiResponse['businessObjects'][$i]['fields'][1]['value'];
  if($status != "Resolved")
  {
    $info[] = $cherwellApiResponse['businessObjects'][$i]['fields'][0]['value'];
    $info[] = $cherwellApiResponse['businessObjects'][$i]['fields'][1]['value'];
    $info[] = $cherwellApiResponse['businessObjects'][$i]['fields'][2]['value'];
    $info[] = $cherwellApiResponse['businessObjects'][$i]['fields'][3]['value'];
    $info[] = $cherwellApiResponse['businessObjects'][$i]['busObRecId'];

  }
}
echo json_encode($info);
//print_r($cherwellApiResponse);

?>
