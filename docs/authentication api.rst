Authentication Api
++++++++++++++++++

In order to create a place to communicate, you must create a **ROOM**. 
Room Management deals with creating, updating, and deleting a room.
When a room is established a call can now take place in it.

Base URL
^^^^^^^^^^^^^

``www.api.securemeeting.org/auth``   


Endpoints
^^^^^^^^^
+---------+---------+-------------------+
| POST   login         /auth/login      |
+---------+---------+-------------------+
| POST   Signup        /auth/signup     |
+---------+---------+-------------------+

.env
^^^^^^^^^^

::

  MONGO_URL=mymongourl
  PORT=8080
  COLLECTION_NAME=Users
  DB_NAME=Users
  SALT_ROUNDS=10
  SECRET_KEY=launchpad2022

User Model
^^^^^^^^^^

::

  {
    "_id":{
      "$oid":"5f6802fb57f9872cb9c40c8c"
    },
    "rooms":[
    ],
    "friends":[
    ],
    "invitedUsers":[
    ],
    "friendRequests":[
    ],
    "email":"kyritzb1232@gmail.com",
    "password":"$2b$10$UQ3fY5xPaJ3b9UmFJD.fNOkwvOJBNiT5x/ZIGAnDClnixe7rEfKv2",
    "firstName":"bry",
    "lastName":"kyr",
    "emailedIsVerified":false,
    "emailVerification":"873c057c-1185-4621-b774-3db4e6a60e08",
    "timeCreated":"2020-09-20T21:33:47-04:00",
    "inviteCode":"BGN6sR",
    "__v":{
      "$numberInt":"0"
    }
  }

Attributes
""""""""""
``_id`` *string*
  Unique identifier for the object.

``roomName`` *string*
  The unique name of the room.

``timeCreated`` *string*
  A *moment.js* formatted time representing when the room was created.

``timeCreated`` *string*
  A *moment.js* formatted time representing when the room should open.

``createdBy`` *string*
  The id of the user that created this room.

``password`` *string*
  The encrypted password of the room. Encrypted using bcrypt.

``members`` *array[string]*
  The id's of the members allowed to join the room.


Login
^^^^^

Logins in a user

``POST`` ``www.api.securemeeting.org/auth/login``

Request
::

  {
      "email": "hello@gmail.com",
      "password": "helloworld123",
  }


Signup
^^^^^^

Creates a user record for a user

``POST`` ``www.api.securemeeting.org/auth/signup``

Request
::

  {
      "email": "hello@gmail.com",
      "password": "helloworld123",
  }