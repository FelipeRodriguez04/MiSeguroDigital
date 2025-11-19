# Sign Up / Sign In Process

## PRO-01 User Signs Up for the Application

When a user wants to sign up for the application, they will have to follow the following steps:

1. Enter the sign up portal provided they have selected the portal for Users (This is a separate portal compared to brokers).
2. Once in, they shall begin filling the presented form, which includes their first name, last name, phone number, date of birth password and email.
3. Once the user has filled all of the data, they will press on the Sign Me Up button which will validate data at both the front end, and produce an HTTP Post to the backend. The post message will contain the information in a serialized JSON format that can be then parsed outside through the request body.
   a. The password coming from the user, as well as the salting and has primer created at the front end should be done on a per request basis and passed back to the API
4. At the backend, the system will perform final validations and register the data in the following order:
   a. First it will create a new record through an INSERTG in the Registro_SignUp_Global table which contains information like the registered email address, the hashed password, the staling and the state of the registry, in this case the sate is going to be active as the account was just created.
   b. Then it will perform a secondary INSERT into the Registro_Global_Usuarios table which contains the  remaining information about the user like their name, last name, and the calculated field ful_nomnre_usuario that contains the full name for display and communication purposes, finally it also stores the phone number and date of birth.
   c. Lastly a Final record is created in the Roles_Users table which creates a record mapping the id_usuario created on the second step with the enum role ‘global_user’ part of the enum which determines that the user is a normal user.
   d. At this point, the system should create an audit record about the changes done to the Users table with the admin id not set ass it does not require the information to be stored.
      i. This step requires setting the operacion_realizada field as INSERT, and it should only include the new data not the antiguo fields as no data was there before. It should reference the id that was just created for user to know what user it is referring to.

## PRO-02: User Sign In Process

When a user wants to sign into the apploication, they must follow this process

1. First the user must access the sign in portal and provide two key pieces of information and email and a password.
2. Once the data is provided, there are two specific checks that have to be done at the backend.
   a. The first check is done against the main registry table to lookup the email and the password provided,
   b. If there is an entry in the global registry of users then we transition to look through a join into either side, broker or user. In the event that the mainr registry entry is in the users we return the data forthwith including the information about the role of the user for RBAC.
3. The user is allowed to sign in as there was a correct response from the database to the front end, that is a 2xx indicating success in the data polling.

## PRO-03: Broker wants to sign up

When a broker wants to sign in to the application, the process changes as it no longer just requires filling a form and going through, instead it follows this process.

1. Firs the new broker access the broker sign up portal, which allows them to effectively fill out the same form, but this one has a special validation.
2. Once the same form as the user is filled, the user will press the required button to sign in and then two steps will be done at the calling to the backend.
   a. First the API will perform a call to and endpoint to GET whether or not the domain of the provided email exists or is registered at the database level. To do this the program should perform a query to the Aseguradora table to find if any of the registered insurance companies contains a matching domain, that is all after the @ in the provided email.
      i. If there is a record, the API endpoiont should return true and allow the application to display a successful validation message and continue with the sign up process,
      ii. If there was no record, the API endpoint should return false and inform of the issue at the front end level, redirecting the user to the normal user sign up screen.
   b. If the api returned a record and we got a Boolean true, then we are going to pass the information to the database through a POST.
      i. In this case, the process for inserting the information remains the same, only that in this case we are going to store the information differently at the Registro_Global_brokers
      ii. In the general registry, the first part of the transaction, the information is stored as with the users, storing the state of the new account as inactiva, the reason for this is that there is an additional validation step needed at the administrator level for an aseguradora,
      iii. Once the data in the main registry is written, then a new record in the Global Brokers tabgle should be written with a mapping to the id of the insurance company that matched the email, and a similar id mapping to the global registry table. In here the data stored is similar to the users, including name, last name, ful name, and other requirements, but it als includes the estado_broker field, which determines if the broker is active, inactive, pending approval , etc. In this case, for the initial insert into the table it should have a value of pendiente.
      iv. Once these two are done, then we are going to create a record at the RegistroAuditAccionesBrokers as a trigger or as part of the stored procedure, in which we store, similar to the users case, the information about the initial data input, marking the operation as INSERT and storing a null at the id_admin_modificacion since no admin has reviewed this application yet.
   c. It is important to note that the sign up process does not indicate that the user can immediately use their credentials for sign up, in the case of brokers the credentials, if still marked as pendiente will not allow the user to continue.

## PRO-04: Broker wants to sign in

When we have a broker that wants to sign in, there are two cases that can happen. The first case is when we have an approved broker, the second is when we have a pendiente broker, in either of these cases we have the following process.

1. First the broker accesses the broker-specific sign in screen which performs additional validations based on the information obtained in the email and password fields.
2. Once the user has inputted the data in the required fields, then the backend will receive a GET for the information of the user and a 200 request to the validation of sign-in.
   a. In this case internally the system will perform two reviews, first it will look in the global registry and look up if the email and hashed password which was created at the front end match the ones stored in the database.
   b. If those match it wil do a lookup at the broker table to find the information about the user that is going to be returned. In this case the information pulled from the database should bne all tcolumns including the estado_broker column,
   c. With the returned data the backend will perform a check to determine if the estado of the brfoker is still pendiente. If it still is pendiente then it will not allow the sign up pass and will return an error code with a explanatory message or error code. If the broker state is rechazado, then we are going to also return an error code to prevent unauthorized access.
      i. If the approver state is no longer pendiente then the application will return a correct code like a 2xx something and allow the user to sign in by returning to the application all of the user’s information.

## PRO-05: Insurance Policy Broker Super Admin or Admin manage broker requests

When a insurance company broker, of the type of super admin or admin enter the application, they will have a view that allows them to see the pending requests that are in need of approval or review. In this case either of these types of admins can perform the following process

1. First the admin would access the specific view or application route that allows them review the pending requests for broker account creation.
2. Thje admin then selects any of the requests that are pending and it displays in a popup the information about the sign up information like name, last name, phjone number, user email address, fecha de nacimineto and its state, t will not show anmy password information.
   a. To return this information the system will perform a query against the application’s backend to a view which will pull a consolidated report that includes the Sign Up data (email only) alongside the information from the Broker’s table where the broker state is pending. Given that the view doers not have any external state, the application will have to filter based on the company’s id of the currently signed in admin. In this case, to do this the request to the backend must include the company id or the email address of the currently signed in user as a request parameter in the JSON body of the request. With this parameter we can then filter the ResultSet coming  back from the database and use that to extract the required information where the id of the requests matches the id of the admin, this means  we need to group by id of aseguradora when pulling from broker’s table.
   b. With this information, the admin will be able to select out oftwo buttons, accept or reject (do nothing is implied as theadmin would jmust not change the state of the request).
      i. In this case if the admin presses the accept button then an internal update process has to be done.
         1. First the application will perform a call to an API endpoint which will call a stored procedure that takes in the ID of the broker to be updated, the id of its registry  (pulled from the view information), and the id of the admin that just changed the state of the request.
         2. Passing this information the stored procedure will do an UPDATE on the Registro_Global_Brokers modifying the estado_broker field to aceptado
         3. Then it will create a record at the Roles_Broker table, using the id of the broker that was just updated, it will create  a record that maps it to the broker_analyst role at a start, this is the default of the field also, this is the base clearance level for any new hires (new registries) in the application.
         4. After this it will create an audit record showcasing a new modification done with an UPDATE state and registering the changes done to the estado only, it does not need to restore all the data that was not modified, but it does require to store the ID of the admin broker that made the changes.
      ii. In the case that the admin presses the reject button, the application will also perform a stored procedure for the UPDATE process of the rejection.
         1. First it will change the state at the brtokers table to rechazado, and then it will record an audit table entry with UPDATE and the new state to rechazado along with the ID of the broker admin who made the change

## PRO-06: Broker admin or superadmin modify roles for a broker

When an admin or super admin at the brokers side of things wants to change the roles of a broker it has to perform the following

1. First it must access the view that allows him for modification, in this case the modification portal will perform a call to the database at another GET endpoint which runs internally another view.
   a. The basckend application will call a view that implements a mechanism for pulling all of the current brokers that are registered. In this case, the view will pull all of the information required, but the backend application will only return the data in a JSON related to the admins in levels of authorization lower than the one pulling the data, effectively, it will need to know (the request), the role that the current user perofmring the reuqeswt has, using this information the rerquest can filter for those records (grouped by the role they have) that have a lower administration level. In this case the view has to execute a join between two tables, first the broker table and the roles broker table joining based on the id of the broker and filtering those that are approved.
   b. Using the information returned from the view the application will display a list of brokers that correspond to the lower levels of administration and display a drop down menu for the state, allowing for the selection of a new role for each of the administrators that have been shown.
      i. In this case, all other fields like the name coming from the brokers table will be shopwn alongside the email coming from the join on the main registry table, and the full name,m in this case then the application will show most of the information that is useful for the admin to validatge who they are moving the data from.
      ii. The system will register this new state in a variable internal to the view and then await for the user action.
   c. Next to each of the entities, which are going to be returned in JSON format and modified most likely as json format at the frontend, stored most likely as a JSON objects stored in an array for example, we are going to allow for the modification of the states and at the end we are going to show a button for saving the changes created.
      i. Once the user presses the button, the entire JSON array of changed entities is going to be passed back to the API. The api is going to iterate over all of these entities modifying based on the broker id passed in the JSON objects the role to the new role defined.

## PRO-07: Global Super Admin or Admin (User Side) wants to modify users

When an admin wants to modify users, the admin must log in with their credentials, and using their credentials they will be directed to the admin portal for application admin, not broker admins. Once there the procedure goes as follows:

1. The global admin or admi  is going to enter a subroute which says Manage users, and this route  is going to diosplay a long list of the registered users in the application. These users are going to be filtered based the authorization level currently requested.
   a. As such we’re going to rely on a view to return the information of users, since the application is not going to be production, we do not need to have consideration for incremental requests of data, instead we are going to return a long list of user informationthat is going to jin both the email from the original global registry data joined with the global user rtegistry. This is going to be grouped by the user role, since this is defaulted for all models, we are going to use that information directly. The data at the view is going to filtered and we are going to return only those users with a authroztiona level lower than the current user for management
   b. Once the data is returned the UI will show a list of users and will allow the the admin to press any of two buttons, modify or delete.
2. If the user presses the modify button, a new form is displayued in wchihw the admin can change some fields and leave others to the previous value, allowing for segmented modification. Once mpodification is done we are going to use a transaction to perform the UPDATE
   a. Internally the first part of the transaction goes ahead and performs an insertion at the audit registry with the id of the admin that is doing the changes and the id of the user that is being changed, inserting alongside it the information of the current change, in this case, storing the antiguo and nuevo state for the x variable that was modified at the user, not all of them,
   b. Then it will perform the actual modification into the user table, performing an UPDATE at the table.
3. If the user presses the delete button, then a transaction is handled to work on the DELETE.
   a. The first step is to record in the audit record that a deletion process is being done onto the user id and by the administrator id like at the modification process,
   b. Then we are going to perform the DLETEW on the actual table.