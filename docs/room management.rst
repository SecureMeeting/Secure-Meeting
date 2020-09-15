Room Management Api
+++++++++++++++++++

In order to create a place to communicate, you must create a *ROOM*. 
Room Management deals with creating, updating, and deleting a room.
When a room is established a call can now take place in it.

Base URL
^^^^^^^^^^^^^

``www.api.securemeeting.org``   


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
    "createdBy":"kyritzb@gmail.com",
    "password":"$2b$10$IUwBkzpHMVnWrwK5/yumwOChWrfADWba1oFzqf4xu07hzdTKsxyc2",
    "__v":{
      "$numberInt":"0"
    }
  }


Attributes
""""""""""
``_id`` string
  Unique identifier for the object.

``roomName`` string
  The unique name of the room

``timeCreated`` string
  The time obtained through moment.js This can be manipulated and checked using moment.js

``createdBy`` string
  The id of the user that created this room

``password`` hash
  The encrypted password of the room. Encrypted using bcrypt.

``members`` array[strings]
  The id's of the members allowed to join the room

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
| DEL    Auth Room       /room/auth     |
+---------+---------+-------------------+

Create a Room
^^^^^^^^^^^^^

Request
::

  {
      "roomName": "castle",
      "createdBy": "kyritzb@gmail.com",
      "password": "helloWorld",
      "members": []
  }


Schedule a Room
^^^^^^^^^^^^^^^

Request
::

  {
      "roomName": "castle",
      "createdBy": "kyritzb@gmail.com",
      "scheduledTime": "2020-09-14T17:00:52+00:00",
      "password": "helloWorld",
      "members": []
  }

Get a Room
^^^^^^^^^^

Request
::

  {
      "roomName": "castle"
  }

Delete a Room
^^^^^^^^^^^^^

Request
::

  {
      "roomName": "castle"
  }


Authenticate a Room
^^^^^^^^^^^^^^^^^^^

Request
::

  {
      "roomName": "castle",
      "password": "helloWorld"
  }


