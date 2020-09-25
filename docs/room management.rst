Room Management Api
+++++++++++++++++++

In order to create a place to communicate, you must create a **ROOM**. 
Room Management deals with creating, updating, and deleting a room.
When a room is established a call can now take place in it.

Base URL
^^^^^^^^^^^^^

``www.api.securemeeting.org/room``   


Endpoints
^^^^^^^^^
+---------+---------+-------------------+
| POST   Create Room     /room/create   |
+---------+---------+-------------------+
| GET    Get Room        /room/get      |
+---------+---------+-------------------+
| DEL    Delete Room     /room/delete   |
+---------+---------+-------------------+
| POST   Schedule Room   /room/schedule |
+---------+---------+-------------------+
| POST   Auth Room       /room/auth     |
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


Room Model
^^^^^^^^^^

A room is a place where a all takes place.

::

  {
    "_id":{
      "$oid":"5f5fa1c4441656001ea0c373"
    },
    "members":[
      
    ],
    "roomName":"castle",
    "timeCreated":"2020-09-14T17:00:52+00:00",
    "scheduledTime": "2020-09-14T17:00:52+00:00",
    "createdBy":"kyritzb@gmail.com",
    "password":"$2b$10$IUwBkzpHMVnWrwK5/yumwOChWrfADWba1oFzqf4xu07hzdTKsxyc2",
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

Create a Room
^^^^^^^^^^^^^

Creates a room record in the mongodb. Does not allow duplicate room names.

``POST`` ``www.api.securemeeting.org/room/create``

Request
::

  {
      "roomName": "castle",
      "createdBy": "kyritzb@gmail.com",
      "password": "helloWorld",
      "members": []
  }

Response
::

  {
      "isSuccess": true,
      "errorName": null,
      "payload": {
          "roomName": "castle",
          "timeCreated": "2020-09-24T23:34:59-04:00",
          "createdBy": "kyritzb@gmail.com",
          "members": []
      }
  }


Schedule a Room
^^^^^^^^^^^^^^^

Creates a room record in the mongodb with a scheduled Time field. Does not allow duplicate room names.

``POST`` ``www.api.securemeeting.org/room/schedule``

Request
::

  {
      "roomName": "castle",
      "createdBy": "kyritzb@gmail.com",
      "scheduledTime": "2020-09-14T17:00:52+00:00",
      "password": "helloWorld",
      "members": []
  }

Response
::

  {
      "isSuccess": true,
      "errorName": null,
      "payload": {
          "roomName": "castle123",
          "timeCreated": "2020-09-25T00:42:01-04:00",
          "scheduledTime": "12/12/2000",
          "createdBy": "kyritzb@gmail.com",
          "members": []
      }
  }

Get a Room
^^^^^^^^^^

Obtains a room record based on the roomName.

``GET`` ``www.api.securemeeting.org/room/get``

Request
::

  {
      "roomName": "castle"
  }
  
Response
::

  {
      "isSuccess": true,
      "errorName": null,
      "payload": {
          "members": [],
          "_id": "5f6d65635eefc60277bcd473",
          "roomName": "castle",
          "timeCreated": "2020-09-24T23:34:59-04:00",
          "createdBy": "kyritzb@gmail.com",
          "__v": 0
      }
  }


Delete a Room
^^^^^^^^^^^^^

Deletes a room record based on the roomName.

``DEL`` ``www.api.securemeeting.org/room/delete``

Request
::

  {
      "roomName": "castle"
  }

Response
::
  {
      "isSuccess": true,
      "errorName": null,
      "payload": true
  }

Authenticate a Room
^^^^^^^^^^^^^^^^^^^

Logs into a room based upon a roomName and a password.

``POST`` ``www.api.securemeeting.org/room/auth``

Request
::

  {
      "roomName": "castle",
      "password": "helloWorld"
  }




