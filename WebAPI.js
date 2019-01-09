var prevPage = new Array();
var prevValue = new Array();
var ticketValues = new Array();
var serviceLump = new Array();
var lastValues = new Array();
var initialHTML = document.getElementById('content').innerHTML;

var shorty;
var techfour = getCookie("OuNetId");
var teamAssignment;
var titleTemp;
var reviewbody;
var tempHTMLHolder;
var canSubmit;
var ownership;

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

/*

@Authors: Scott Kannawin, Eric Morales, Eric Rhodes
@Owner: Services Studio

This it the javascript api used as data and flow control of this ticketing app.
It delegates which view of the page is to be shown at what time,
while passing and retriving data to/from the proper back end file via ajax and jquery calls.

*/
function newTicket()
{
	prevPage = new Array();
	prevValue = new Array();
	ticketValues = new Array();
	serviceLump = new Array();
	document.getElementById('content').innerHTML = initialHTML;
}
//----------------------------------------- Beginning of mobile app incident----------------------------------------------------//
/*
	Determines which team the incident will be assigned to.
*/
function ownership()
{
	//Displays the table of categories, back button, and title of the page.
	$.get('Sources/html/title.html', function (data)
	{
		titleTemp = data;
	});
	//Default ownerships
	var ownership = [ "Myself to fill out later",
					  "Services Team to work and resolve"];
	// code for IE7+, Firefox, Chrome, Opera, Safari
	if (window.XMLHttpRequest)
	{
		xmlhttp=new XMLHttpRequest();
	}
	// code for IE6, IE5
	else
	{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	//Event handler
	xmlhttp.onreadystatechange=function()
	{
		//Event handler
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var obj = JSON.parse(xmlhttp.responseText);
			//Saves the content of the previous page ************
			var a = document.getElementById('content');
			prevPage.push(a.innerHTML);

			a.innerHTML = titleTemp;
			//Sets the title of the page
			document.getElementById('td00').innerHTML = "CREATE AND ASSIGN TO:";
			//Displays the buttons of the pages
			for(i = 0; i< ownership.length;i++)
			{
				a.innerHTML += "<div class='newButton'><button type='button' class='w3-button' onclick='impacted(\""+ownership[i]+"\")'\/>"+ownership[i]+"<\/div><br>";
			}
		}
	}
	//Opens up the file to retrieve the services impacted from the server
	xmlhttp.open("GET","/Categories.php?type=1",true);
	xmlhttp.send();
}

/*

*/
function impacted(str)
{
	//Stores the variable of the ticket ownership
	ownership = str;
	//Displays the table of categories, back button, and title of the page.
	$.get('Sources/html/title.html', function (data)
	{
		titleTemp = data;
	});
	//Includes the most common used service impacted categories
	var mostCommon = [ "Accounts & Authentication","Device Support", "Email & Calendar"];
	// code for IE7+, Firefox, Chrome, Opera, Safari
	if (window.XMLHttpRequest)
	{
		xmlhttp=new XMLHttpRequest();
	}
	// code for IE6, IE5
	else
	{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	//Event handler
	xmlhttp.onreadystatechange=function()
	{
		//Event handler
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var obj = JSON.parse(xmlhttp.responseText);

			var a = document.getElementById('content');
			prevPage.push(a.innerHTML);

			a.innerHTML = titleTemp;
			//Sets the title of the page
			document.getElementById('td00').innerHTML = "SERVICE IMPACTED:";
			//Displays the most common buttons of the pages
			for(i = 0; i< mostCommon.length;i++)
			{
					a.innerHTML += "<div class='newButton'><button type='button' class='w3-button' onclick='categories(\""+mostCommon[i]+"\")'\/>"+mostCommon[i]+"</button><\/div><br>";
			}
			//Displays the buttons of the pages
			for(i = 0; i < obj.length; i++)
			{
				//Excludes the most common, so they won't be repeated
				if(mostCommon.indexOf(obj[i]) == -1)
				{
					content = obj[i];
					a.innerHTML += "<div class='newButton'><button type='button' class='w3-button' onclick='categories(\""+content+"\")'\/>"+content+"</button><\/div><br>";
				}
			}
		}
	}
	//Opens up the file to retrieve the categories from the server
	xmlhttp.open("GET","/Categories.php?type=1",true);
	xmlhttp.send();
}

//loads the categories
function categories(str)
{
	//List does not include the categories that will ask for more information -- will give error when submitting
	var dontinclude = ["Hardware Check-In", "Walk-In Support"];
	//puts the service impacted into the first slot of the servicelump array
	serviceLump[0] = str;
	// code for IE7+, Firefox, Chrome, Opera, Safari
	if (window.XMLHttpRequest)
	{
		xmlhttp=new XMLHttpRequest();
	}
	// code for IE6, IE5
	else
	{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	//Event handler
	xmlhttp.onreadystatechange=function()
	{
		//Event handler
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var obj = JSON.parse(xmlhttp.responseText);
			var a = document.getElementById('content');

			prevPage.push(a.innerHTML);

			a.innerHTML = titleTemp;
			//Populates the services impacted to show the breadcrumbs
			document.getElementById('td01').innerHTML = str;
			//Sets the title of the page
			document.getElementById('td00').innerHTML = "CATEGORY:";
			//Displays the buttons of the pages
			for(var i = 0; i < obj.length; i++)
			{
				//To not include the categories that will give errors.
				if(dontinclude.indexOf(obj[i]) == -1)
				{
					a.innerHTML += "<div class='newButton'><button type='button' id='"+str+"' class='w3-button' onclick='subcategory(\""+ obj[i] +"\")'\/>"+obj[i]+"</button><\/div><br>";
				}
			}
		}
	}
	//Opens up the file to retrieve the subcategories from the server
	xmlhttp.open("GET","/Categories.php?type=2&affected=" + escape(str) ,true);
	xmlhttp.send();
}

function subcategory(str)
{
	serviceLump[1] = str; //puts the previously selected category into the second slot of servicelump
	var disinclude = ["Hardware Check-In", "Express Check-In"];
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	//Event handler
	xmlhttp.onreadystatechange=function()
	{
		//Event handler
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var obj = JSON.parse(xmlhttp.responseText);
			var a = document.getElementById('content');
			prevPage.push(a.innerHTML);

			a.innerHTML = titleTemp;
			//Populates the services impacted to show the breadcrumbs
			document.getElementById('td01').innerHTML = serviceLump[0];
			document.getElementById('td02').innerHTML = str;
			//Sets the title of the page
			document.getElementById('td00').innerHTML = "SUBCATEGORY:";
			//Displays the buttons of the pages
			for(var i = 0; i < obj.length; i++)
			{
				//To not include the categories that will give errors.
				if(disinclude.indexOf(obj[i]) == -1)
				{
					a.innerHTML += "<div class='newButton'><button type='button' id='"+ str +"' class='w3-button' onclick='mainBody(\""+obj[i]+"\")'\/>"+obj[i]+"</button><\/div><br>";
				}
			}
		}
	}
	xmlhttp.open("GET","/Categories.php?type=3&affected=" + escape(serviceLump[0]) + "&category=" + escape(serviceLump[1]) ,true);
	xmlhttp.send();
}
//The part where you fill in information for a general non express check in ticket
//by the point where it is to here the user will have the full service impacted/category/subcategory
//if they found out how to bypass that... good job
function mainBody(str)
{
	//If they decided to own the ticket, it will go through the technician flowpath that requires less information
	if(ownership == "Myself to fill out later")
	{
		technician(str);
		teamAssignment = 'na';
	}
	//If they decided to send to Services, it will go through the services flow path that requires more troubleshooting.
	else if(ownership == "Services Team to work and resolve")
	{
		services(str);
		teamAssignment = 'Services';
	}
}
function technician(str)
{
	//gathers the subcategory from previous inputs, or it will split the string and make the first 3 data points
	//within servicelump the
	if(str.includes("//") == false)
	{
		serviceLump[2] = str;
	}
	else
	{
		serviceLump = str.split("//");
	}
	//1400 max length for the description as there is a 2083 character max through a url
	var a = document.getElementById('content');
	prevPage.push(a.innerHTML);

	if (str.length==0)
	{
		document.getElementById("openingText").innerHTML="This is a string";
		return;
		document.getElementById("openingText").style.border="0px";
	}
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	//populates the data within the mainbody, uses the html file from the sources and then populates the list of buildings
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			//Populates the title
			document.getElementById('td00').innerHTML = "OWNED TICKET INFORMATION";
			//Populates the table
			document.getElementById('td01').innerHTML = serviceLump[0];
			document.getElementById('td02').innerHTML = serviceLump[1];
			document.getElementById('td03').innerHTML = serviceLump[2];

			var obj = JSON.parse(xmlhttp.responseText);
			var a = document.getElementById('content');
		}
	}
	//loads neccessary components for the mainbody and review portions to operate from HTML files
	$(document).ready(function()
	{
		$("#content").load('Sources/html/techMainBody.html');
		$.get('Sources/html/review.html', function (data)
		{
			reviewbody = data;
		});
	});

	//Loads the building list to be displayed
	xmlhttp.open("GET","/buildings.php" ,true);
	xmlhttp.send();
}
function services(str)
{
	//gathers the subcategory from previous inputs, or it will split the string and make the first 3 data points
	//within servicelump the
	if(str.includes("//") == false)
	{
		serviceLump[2] = str;
	}
	else
	{
		serviceLump = str.split("//");
	}
	//1400 max length for the description as there is a 2083 character max through a url
	var a = document.getElementById('content');
	prevPage.push(a.innerHTML);

	if (str.length==0)
	{
		document.getElementById("openingText").innerHTML="This is a string";
		return;
		document.getElementById("openingText").style.border="0px";
	}
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	//populates the data within the mainbody, uses the html file from the sources and then populates the list of buildings
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			//Populates the title
			document.getElementById('td00').innerHTML = "SERVICES TICKET INFORMATION";
			//Populates the table
			document.getElementById('td01').innerHTML = serviceLump[0];
			document.getElementById('td02').innerHTML = serviceLump[1];
			document.getElementById('td03').innerHTML = serviceLump[2];

			var obj = JSON.parse(xmlhttp.responseText);
			var a = document.getElementById('content');

			//grabs all of the buildings from the database
			for(var i = 0; i < obj.length; i++)
			{
				document.getElementById('dropdown').innerHTML += "<option value='"+obj[i]+"'>"+obj[i]+"</option>";
			}
		}
	}
	//loads neccessary components for the mainbody and review portions to operate from HTML files
	$(document).ready(function()
	{
		$("#content").load('Sources/html/servMainBody.html');
		$.get('Sources/html/review.html', function (data)
		{
			reviewbody = data;
		});
	});
	//Loads the building list to be displayed
	xmlhttp.open("GET","/buildings.php" ,true);
	xmlhttp.send();

}
//gets the data ready to be reviewed, validates the form given to it. if its valid, it will be sent to the review view
function techReviewTicket()
{
	//Retrieves the affected user's OUNETID
	serviceLump[3] = document.getElementById('fourfour').value;
	lastValues['fourfour'] = serviceLump[3];
	//Retrieves the short description
	shorty = document.getElementById('shorty').value;
	lastValues['shorty'] = shorty;
	//Retrieves the long description
	serviceLump[7] = document.getElementById('description').value;
	lastValues['description'] = serviceLump[7];
	lastValues['techfour'] = techfour;
	//Sets the phone to null
	serviceLump[5] = "";
	lastValues['phone'] = serviceLump[5];
	//Sets the email to null
	serviceLump[6] = "";
	lastValues['email'] = serviceLump[6];
	//Sets the room number to null
	serviceLump[9] = "";
	lastValues['roomNumber'] = serviceLump[9];
	//Sets the building to null
	serviceLump[8] = "";
	lastValues['building'] = serviceLump[8];

	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText == "TRUE" || serviceLump[3].toLowerCase() == "guest")
			{
				//pushes all relavent data to the back stack
				var a = document.getElementById('content');
				prevPage.push(a.innerHTML);
				ticketValues.push(shorty);
				ticketValues.push(techfour);
				ticketValues.push(serviceLump[3]);
				ticketValues.push(serviceLump[7]);
				ticketValues.push(serviceLump[5]);
				ticketValues.push(serviceLump[6]);
				ticketValues.push(serviceLump[9]);
				ticketValues.push(serviceLump[8]);


				//checks if the bare minimum requirements are met for the ticket (4+4, title, description)
				var affectedInput = document.getElementById('fourfour');
				var shortyInput = document.getElementById('shorty');

				a.innerHTML = reviewbody;
				reviewHelper2();

				if(affectedInput.value == "")
				{
					alert("Affected user was not filled in correctly");
					goBack(true);
				}
				if(shortyInput.value == "")
				{
					alert("Short description user was not filled in correctly");
					goBack(true);
				}
			}
			else
			{
				alert("The affected user OUNetID you entered is not valid, if you would like to create a ticket for Guest User enter 'Guest' as affected user.")
				document.getElementById('submit').innerHTML = "	<input type='submit' id='reviewButton' class='button' value='Submit Ticket' onclick='techReviewTicket()'/>";
			}
		}
	}
  //Verify the username is valid
	xmlhttp.open("GET","/verifourcation.php?four=" + serviceLump[3], true);
	xmlhttp.send();
}

//gets the data ready to be reviewed, validates the form given to it. if its valid, it will be sent to the review view
function reviewTicket()
{
	//to go to the submit list
	serviceLump[3] = document.getElementById('fourfour').value;
	lastValues['fourfour'] = serviceLump[3];
	shorty = document.getElementById('shorty').value;
	lastValues['shorty'] = shorty;
	techfour = 'none';
	serviceLump[7] = document.getElementById('description').value;
	lastValues['description'] = serviceLump[7];
	serviceLump[5] = document.getElementById('phone').value;
	lastValues['phone'] = serviceLump[5];
	serviceLump[6] = document.getElementById('email').value;
	lastValues['email'] = serviceLump[6];
	serviceLump[9] = document.getElementById('roomNumber').value;
	lastValues['roomNumber'] = serviceLump[9];
	serviceLump[8] = document.getElementById('dropdown').options[document.getElementById('dropdown').selectedIndex].value;
	lastValues['building'] = serviceLump[8];

	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if(xmlhttp.responseText == "TRUE" || serviceLump[3].toLowerCase() == "guest")
			{
				//pushes all relavent data to the back stack
				var a = document.getElementById('content');
				prevPage.push(a.innerHTML);
				ticketValues.push(shorty);
				ticketValues.push(serviceLump[3]);
				ticketValues.push(serviceLump[7]);
				ticketValues.push(serviceLump[5]);
				ticketValues.push(serviceLump[6]);
				ticketValues.push(serviceLump[9]);
				ticketValues.push(serviceLump[8]);


				//checks if the bare minimum requirements are met for the ticket (4+4, title, description)
				var affectedInput = document.getElementById('fourfour');
				var shortyInput = document.getElementById('shorty');

				a.innerHTML = reviewbody;
				reviewHelper2();

				if(affectedInput.value == "")
				{
					alert("Affected user was not filled in correctly");
					goBack(true);
				}
				if(shortyInput.value == "")
				{
					alert("Short description user was not filled in correctly");
					goBack(true);
				}
			}
			else
			{
				alert("The affected user OUNetID you entered is not valid, if you would like to create a ticket for Guest User enter 'Guest' as affected user.");
				document.getElementById('submit').innerHTML = "	<input type='submit' id='reviewButton' class='button' value='Submit Ticket' onclick='reviewTicket()'/>";
			}
		}

	}
  //Verify the username is valid
	xmlhttp.open("GET","/verifourcation.php?four=" + serviceLump[3] ,true);
	xmlhttp.send();
}

//populates each data point for a ticket given from the blank html file
function reviewHelper2()
{
	var str = "<h3>Affected User:</h3>\t" + serviceLump[3] + "<br>";
		$('#user').html(str);
	if(techfour != "none")
	{
		str = "<h3>technician:</h3>\t" + techfour + "<br>";
			$('#tech').html(str);
	}
	str = "<h3>Short Description:</h3>\t" + shorty + "<br>";
		$('#shorty').html(str);
	if(serviceLump[7] != "")
	{
		str = "<h3>Long Description:</h3>\t" + serviceLump[7] + "<br>";
		$('#description').html(str);
	}
	else
	{
		str = "<h3>Long Description:</h3>\t" + "On-site Quick-Ticket" + "<br>";
		$('#description').html(str);
	}
	if(serviceLump[5] != "")
	{
		str = "<h3>Users Alternate Phone:</h3>\t" + serviceLump[5] + "<br>";
		$('#phone').html(str);
	}
	if(serviceLump[6] != "")
	{
		str = "<h3>Users Alternate Email:</h3>\t" + serviceLump[6] + "<br>";
		$('#email').html(str);
	}
	if(serviceLump[8] != "")
	{
		str = "<h3>Building:</h3>\t" + serviceLump[8] + "<br>";
		$('#building').html(str);
	}
	if(serviceLump[9]){
		str = "<h3>Room Number:</h3>\t" + serviceLump[9] + "<br>";
		$('#roomnum').html(str);
	}
}

//go to previous page or handles errors in ticket submission
function goBack(x)
{
	var a = document.getElementById('content');
	a.innerHTML = prevPage.pop(); //gets html of previous page
	if(document.getElementById('ticketing') != null)
	{
		var textBox = document.getElementById('ticketing');
		textBox.value = prevValue.pop();
	}
	//if it needs to go back to the form it'll pop the stack and populate
  if(document.getElementById('fourfour') != null)
	{
		if(teamAssignment == "Services")
		{
		document.getElementById('dropdown').selectedIndex = lastValues['building'];
		document.getElementById('roomNumber').value = lastValues['roomNumber'];
		document.getElementById('email').value = lastValues['email'];
		document.getElementById('phone').value = lastValues['phone'];
		document.getElementById('description').value = lastValues['description'];
		document.getElementById('fourfour').value = lastValues['fourfour'];
		document.getElementById('shorty').value = lastValues['shorty'];
		document.getElementById('techfour').value = techfour;
		document.getElementById('submit').innerHTML = "	<input type='submit' id='reviewButton' class='button' value='Submit Ticket' onclick='reviewTicket()'/>";
		}
		if(teamAssignment == "na")
		{
			document.getElementById('description').value = lastValues['description'];
			document.getElementById('fourfour').value = lastValues['fourfour'];
			document.getElementById('shorty').value = lastValues['shorty'];
			document.getElementById('submit').innerHTML = "	<input type='submit' id='reviewButton' class='button' value='Submit Ticket' onclick='techReviewTicket()'/>";
		}
	}
	//this is for error checking, it requires 4+4, title, and description
	var d = document.getElementById('fourfour');
	if(d !== null)
	{
		d.style.borderWidth = '0px';
	}
	//x is the input: used to determine if this method needs to error check or not
	if(x)
	{
		//sets the border of the text box of the bad input to red
		var d = document.getElementById('fourfour');
		if(d.value == ""){
			d.style.borderColor = 'red';
			d.style.borderWidth = '2px';
			d.style.borderStyle = 'solid';
		}
		var c = document.getElementById('shorty');
		if(c.value == ""){
			c.style.borderColor = 'red';
			c.style.borderWidth = '2px';
			c.style.borderStyle = 'solid';
		}
	}
}

//submits
function submit()
{
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	//if the request for the ticket is created properly it will allow for the system to create a direct link to the cherwell
	//ticket itself, or it will throw an error and go back to review the ticket.
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			console.warn(xmlhttp.responseText);
			var obj = JSON.parse(xmlhttp.responseText);
			var a = document.getElementById('content');
			if(obj.busObRecId != null)
			{
				//creates a link if it validates the submit
				var linkOut = "cherwell_URL" + obj.busObRecId;

				a.innerHTML = "<br><div id='openingText' style='background-color:rgba(0,0,0,.35);margin-left:2.5%;width:95%;'><a href='"+linkOut+"' target='_blank'><h1>Ticket number: "
										+obj.busObPublicId+"<\/h1></a><br></div>";

				a.innerHTML += "<div class='buttonDiv'><input type='submit' id='button3' class='button' value='New Ticket' onclick='window.location.reload()' /></div>";
			}
			else
			{
				a.innerHTML = "";
				alert("Failed to send, some things that may have caused it:\n- Wrong 4+4 for the technician\n- Cherwell is down");
				goBack();
				reviewTicket();
			}
		}
	}
	//used for creating a new ticket instead of express check in, sends the proper data to the back end
	//for data validation and allowing the ticket to be
	if(serviceLump[7] != "")
	{
		var readyURL = "/QuickTicketBackend.php?service=" + serviceLump[0] +
			"&category=" + serviceLump[1] +
			"&sub=" + serviceLump[2] +
			"&user=" + serviceLump[3] +
			"&phone=" + serviceLump[5] +
			"&email=" + serviceLump[6] +
			"&buildingFull=" + serviceLump[8] +
			"&roomNumber=" + serviceLump[9] +
			"&long=" + serviceLump[7]+
			"&userIn=" + techfour +
      "&teamAssign=" + teamAssignment +
			"&shorty=" + shorty;
	}
	else
	{
		var readyURL = "/QuickTicketBackend.php?service=" + serviceLump[0] +
			"&category=" + serviceLump[1] +
			"&sub=" + serviceLump[2] +
			"&user=" + serviceLump[3] +
			"&phone=" + serviceLump[5] +
			"&email=" + serviceLump[6] +
			"&buildingFull=" + serviceLump[8] +
			"&roomNumber=" + serviceLump[9] +
			"&long=" + "On-site Quick-Ticket" +
			"&userIn=" + techfour +
      "&teamAssign=" + teamAssignment +
			"&shorty=" + shorty;
	}
	document.getElementById('superDiv').innerHTML = "";
	xmlhttp.open("GET",readyURL ,true);
	xmlhttp.send();
	document.getElementById('content').innerHTML = "<div id='openingText'>"+
												   "	<h1>Submitting Ticket. Please wait...<\/h1>"+
												   "	<img src='./images/ring-alt.gif' id='loading' alt='loading' style='height:50px;width:50px;'/>"+
												   "<\/div>";
}
//------------------------------------------- End of Quick Ticket incident ----------------------------------------------------//
//------------------------------------------- Beginning of Express Check-in ---------------------------------------------------//
//loads the express check in body
function expressBody()
{
	$(document).ready(function()
	{
		$("#content").load('Sources/html/express.html');
		prevPage.push(document.getElementById('content').innerHTML);
		$.get('Sources/html/reviewExpress.html', function(data)
		{
			reviewbody = data;
		});
	});
}

//gathers the data given for an express check in to then be sent to the review page to be submitted into the system
function reviewExpress()
{
	var innerht = document.getElementById('content').innerHTML;

	serviceLump[0] = "Device Support";//
	serviceLump[1] = "Partnership On-Site Support";//
	serviceLump[2] = "Express Check-In"; //
	serviceLump[3] = document.getElementById('techfour').value;
	serviceLump[4] = document.getElementById('phone').value;
	serviceLump[5] = document.getElementById('email').value;
	serviceLump[6] = document.getElementById('userfour').value;
	serviceLump[7] = document.getElementById('userphone').value;
	serviceLump[8] = document.getElementById('type').options[document.getElementById('type').selectedIndex].value;
	serviceLump[9] = document.getElementById('make').options[document.getElementById('make').selectedIndex].value;
	serviceLump[10] = document.getElementById('serial').value;
	serviceLump[11] = document.getElementById('backup').options[document.getElementById('backup').selectedIndex].value;
	serviceLump[12] = document.getElementById('pickup').value;
	serviceLump[13] = document.getElementById('pickuproom').value;
	serviceLump[14] = document.getElementById('drop').value;
	serviceLump[15] = document.getElementById('droproom').value;
	serviceLump[16] = document.getElementById('description').value;
	serviceLump[17] = document.getElementById('name').value;

	for(var i = 3; i < serviceLump.length;i++){
		ticketValues.push(serviceLump[0]);
	}
	//an array of the html elements used for this.
	var htmlID = ['techfour', 'phone','email','userfour','userphone','type','make','serial','backup','pickup','pickuproom','drop','droproom','description','name'];

	var isValid = validExpress(htmlID);

	if(isValid == true){
		document.getElementById('content').innerHTML = reviewbody;
		reviewHelper();
	}
	else{
		expressReturn(htmlID);
	}
}

//populates the data from the html file for reviewing the express check in
function reviewHelper()
{
	var str = "<h3>Technicians name(OUNetID):</h3>\t" + serviceLump[17] + " (" + serviceLump[3] + ")<br>";
		$('#techname').html(str);
	str = "<h3>Technicians phone and email:</h3>\t" + serviceLump[4] + "\t" + serviceLump[5] + "<br><br>";
		$('#techphone').html(str);
	str = "<h3>Affected User OUNetID:</h3>\t" + serviceLump[6] + "<br>";
		$('#userfour').html(str);
	str = "<h3>Affected User phone:</h3>\t" + serviceLump[7] + "<br><br>";
		$('#userphone').html(str);
	str = "<h3>Computer Type:</h3>\t" + serviceLump[8] + "<br>";
		$('#type').html(str);
	str = "<h3>Computer Make:</h3>\t" + serviceLump[9] + "<br>";
		$('#make').html(str);
	str = "<h3>Serial Number:</h3>\t" + serviceLump[10] + "<br>";
		$('#serial').html(str);
	str = "<h3>Backup Option:</h3>\t" + serviceLump[11] + "<br><br>";
		$('#backup').html(str);
	str = "<h3>Pickup Location:</h3>\t" + serviceLump[12] + "\t" + serviceLump[13] + "<br>";
		$('#pickup').html(str);
	str = "<h3>Delivery Location:</h3>\t" + serviceLump[14] + "\t" + serviceLump[15] + "<br><br>";
		$('#delivery').html(str);
	str = "<h3>Description:</h3>\t" + serviceLump[16] + "<br>";
		$('#description').html(str);
}

//form validation for express check in, goes through and checks to see if any data points are empty
function validExpress(htmlID)
{
	canSubmit = true;
	for(i = 3; i < serviceLump.length;i++)
	{
		if(serviceLump[i] == "")
		{
			alert("something went wrong");
			canSubmit = false;
			break;
		}
	}
	for(var i = 3; i < serviceLump.length;i++)
	{
		if(serviceLump[i] == "")
		{
			document.getElementById(htmlID[i-3]).style.borderColor = 'red';
			document.getElementById(htmlID[i-3]).style.borderWidth = '2px';
			document.getElementById(htmlID[i-3]).style.borderStyle = 'solid';
		}
	}
	return canSubmit;
}

//submits the express check in as well as validates the form
function submitExpress()
{
	//gets the request to submit the ticket itself
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	//if the request went through it will allow the data to go through here, creating a direct link to cherwell
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			console.warn(xmlhttp.responseText);
			var obj = JSON.parse(xmlhttp.responseText);
			var a = document.getElementById('content');
			if(obj.busObRecId !== null)
			{
				//creates a link if it validates the submit
				var linkOut = "cherwell_URL" + obj.busObRecId;

				a.innerHTML = "<br><div id='openingText' style='background-color:rgba(0,0,0,.35);margin-left:2.5%;width:95%;'><a href='"+linkOut+"' target='_blank'><h1>Ticket number: "
										+obj.busObPublicId+"<\/h1></a><br></div>";

				a.innerHTML += "<div class='buttonDiv'><input type='submit' id='button1' class='button' value='New Ticket' onclick='newTicket()' /></div>";
			}
			else
			{
				a.innerHTML = "";
				alert(xmlhttp.responseText);
				//goBack();
				///reviewTicket();
				a.innerHTML = innerht;
			}
		}
	}

	//sends all the necessary variables to the backend to be submitted, will check the validity of the data back there
	var readyURL = "/QuickTicketExpress.php?tech=" + serviceLump[3] +
			"&p=" 		+serviceLump[4]+
			"&e=" 		+serviceLump[5]+
			"&user=" 	+serviceLump[6]+
			"&up="		+serviceLump[7]+
			"&ct=" 		+serviceLump[8]+
			"&cm=" 		+serviceLump[9]+
			"&sn=" 		+serviceLump[10]+
			"&bu=" 		+serviceLump[11]+
			"&pl=" 		+serviceLump[12]+
			"&pr=" 		+serviceLump[13]+
			"&dl=" 		+serviceLump[14]+
			"&dr=" 		+serviceLump[15]+
			"&d=" 		+serviceLump[16];

	//if the form has been validated it will allow the ticket to submit, thereby allowing it to
	if(canSubmit){
		xmlhttp.open("GET",readyURL ,true);
		xmlhttp.send();
		document.getElementById('content').innerHTML = "<div id='openingText'><h1>Submitting Ticket. Please wait...<\/h1><img src='./images/ring-alt.gif'"
		 																						 + "id='loading' alt='loading' style='height:50px;width:50px;'/><\/div>";
	}

}

//The back button if the express check in being used, its quicker, the express back button
function expressReturn(htmlID)
{
	if(ticketValues.includes(0))
	{
		for(var i = htmlID.length-1; i>=0;i--)
		{
			document.getElementById(htmlID[i]).value = ticketValues.pop();
		}
		//sets the borders to red if the form is invalid anyhwere, else they will disappear if going back.
		for(i = 3; i < serviceLump.length;i++)
		{
			if(serviceLump[i] == "")
			{
				document.getElementById(htmlID[i-3]).style.borderColor = 'red';
				document.getElementById(htmlID[i-3]).style.borderWidth = '2px';
				document.getElementById(htmlID[i-3]).style.borderStyle = 'solid';
			}
			else
			{
				document.getElementById(htmlID[i-3]).style.borderColor = 'black';
				document.getElementById(htmlID[i-3]).style.borderWidth = '0px';
			}
		}
	}
}
