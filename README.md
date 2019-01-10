# Cherwell Mobile App

The Cherwell Mobile Web App is for technicians that are primarily on-site helping users. It is recommended that each user that is assisted have an incident associated with the assistance to be able to follow up or continue to monitor in case the issue persist. The Web App also includes a section where they are able to view and be redirected to incident or task that they own when they accessed the page. It will include a title, long description. 
Usable on anything with a web browser:<br>
	- Phones<br>
	- Tablets<br>
	- Computers<br>

It starts with a button to create a ticket or express check-in. 

Once the button to create a ticket is selected, the technician will then select the categories in which the ticket falls under using a system to grab the categories from a database containing them.

The main body then loads, but before the body loads the list of buildings must be loaded as well.
This eliminates imperfect input for Cherwell and allows for the inclusion of Building Codes for if there is an included building code with the building name included.
Once the buildings load from the API the HTML then can be loaded onto the screen allowing for further input for the ticket.

Required Fields:<br>
	- User's 4+4 (OUNetID)<br>
	- Ticket Title (Short Description)<br>
	- Long Description of the ticket<br>
	
Optional Fields:<br>
	- Additional Phone number<br>
	- Alternate Email Address<br>
	- Room Number<br>
	- Building Name<br>

Express Check-In Fields:<br>
	- Technician info<br>
		- Name<br>
		- OUNetID<br>
		- Phone<br>
		- Email<br>
	- Affected user info<br>
		- OUNetID<br>
		- Phone<br>
	- Computer Info<br>
		- Type<br>
		- Make<br>
		- Serial Number<br>
		- Data Backup option<br>
		- Pickup Location/Room<br>
		- Dropoff Location/Room<br>
	- Description<br>

	
Once the submit button is pressed it will verify that there is some information within the required fields and populate a review screen to which the Technician can verify that the information is correct.

The username must be consistent with an actual employee or else it will come back with a null ticket, and notify the user that something went wrong because a ticket was not submitted. It will then give a reason for what went wrong. 

Once the ticket is correctly submitted, it will communicate directly with the actual Cherwell API to create a ticket.
In the test version we do not have an API key that is temporarily stored for the App to quickly access Cherwells API, so the 

Once the loading of the API key and ticket has been submitted it will generate a URL for the technician to be able to be redirected to the incident created in Cherwell. 

	- It will appear as the ticket number itself
	- When clicked it will open a new tab with the web verison of cherwell.
	- There will be a button at the very bottom to allow the Technician to create a new ticket as well starting from the Service Impacted screen.
		- Once express check in and Hardware check options are created this should take the Technician back to the home page
		
There is also a menu button that is apparent on all web pages contains: <br>
	- Home <br>
	- My Incident<br>
	- My Task<br>
	- Feedback
	- Logout 
