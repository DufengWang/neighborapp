# neighborapp

This is an app that helps neighbors connect with each other and utilizes each other as a safety net.

How to run it: 
 1. mongod + npm start. 
 2. Open browsers in both Incognito mode and normal mode 
 3. register for 2 new users and login (some name has already been registered, please try another one if this occurs)
 4. edit profile for both accounts and submit
 5. go to add neighbor page, try a username that doesn't exist, and try the other one that exists (the one you just registered)
 6. go to the other account page and refresh add neighbor, you should be able to see a request
 7. click on accept button will save the neighbor in contacts, or you can click on decline
 8. go to contacts page you'll find the neighbor you just added (in either account), and you can check their profile by clicking on them
 9. go to the protected page for both accounts ('/protected' endpoint)
 10. click on SOS on either one, the other one should receive an alert
	

MVP Features (Already Implemented):
 1. Login/Authentification
 2. Edit/Save Profile
 3. Add Friends: send out request to a specific user by username, accept/decline request, search if a user exists or not by username
 4. Contacts: contingent on add friends, ability to view contacts' profile
 5. SOS Button: alert every one in the network on realtime (when user is on the protected endpoint)

Future Features:
 1. Live Chat Room
 2. Check if anyone's around
 3. Visual Improvements


Author: Dufeng Wang
