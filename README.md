# Cherwell Mobile App
this is a staged commit for quick-ticket
Usable on anything with a web browser:
	- Phones
	- Tablets
	- Computers

It starts with a button to create a ticket, express check-in. 

Once the button to create a ticket is selected, the technician will then select the categories in which the ticket falls under using a system to grab the categories from a database containing them.

The main body then loads, but before the body loads the list of buildings must be loaded as well.
This eliminates imperfect input for Cherwell and allows for the inclusion of Building Codes for if there is an included building code with the building name included.
Once the buildings load from the API the HTML then can be loaded onto the screen allowing for further input for the ticket.

Required Fields:
	- User's 4+4 (OUNetID)
	- Ticket Title (Short Description)
	- Long Description of the ticket
	
Optional Fields:
	- Additional Phone number
	- Alternate Email Address
	- Room Number
	- Building Name

Express Check-In Fields:
	- Technician info
		- Name
		- OUNetID
		- Phone
		- Email
	- Affected user info
		- OUNetID
		- Phone
	- Computer Info
		- Type
		- Make
		- Serial Number
		- Data Backup option
		- Pickup Location/Room
		- Dropoff Location/Room
	- Description

	
Once the submit button is pressed it will verify that there is some information within the required fields and populate a review screen to which the Technician can verify that the information is correct.

The username must be consistent with an actual employee or else it will come back with a null ticket, and notify the user that something went wrong because a ticket was not submitted. It will then give a reason for what went wrong. 

Once the ticket is correctly submitted, it will communicate directly with the actual Cherwell API to create a ticket.
In the test version we do not have an API key that is temporarily stored for the App to quickly access Cherwells API, so the 

Once the loading of the API key and ticket has been submitted it will generate a URL for the technician to be able to be redirected to the incident created in Cherwell. 

	- It will appear as the ticket number itself
	- When clicked it will open a new tab with the web verison of cherwell.
	- There will be a button at the very bottom to allow the Technician to create a new ticket as well starting from the Service Impacted screen.
		- Once express check in and Hardware check options are created this should take the Technician back to the home page
