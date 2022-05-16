Creates Routers for Tasks and Users servieces i.e. (New user, new task, delete user, ...etc).


Task.js

Uses Express Module to handle router creation.
Each access to any route requires user to be authenticated first. (Existing and valid user)
Gives user the ability to:
-Create a new task
-Read all previously added tasks
-Read a specific task (with its id)
-Update a specific task (with its id)
-Delete a specific task

User.js

Similiar to the task.js, User routes are created using the express module
All routes except creating a new users requires the user to be logged in and authenticated first.
Gives the user the ability to:
-Create a new user
-Edit user data
-Delete user data
-Loggout (single session or all active session)
-Upload user avatar
