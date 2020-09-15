===================
Room Management Api
===================

Room Management
+++++++++++++++

In order to create a place to communicate, you must create a *ROOM*. 
Room Management deals with creating, updating, and deleting a room.
When a room is established a call can now take place in it.

Base URL
^^^^^^^^^^^^^

.. www.api.securemeeting.org

Room Model
^^^^^^^^^^

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
  

Endpoints
^^^^^^^^^
+---------+---------+-------------------+
| POST | Create Room   | /room/create   |
+---------+---------+-------------------+
| GET  | Get Room      | /room/get      |
+---------+---------+-------------------+
| DEL  | Delete Room   | /room/delete   |
+---------+---------+-------------------+
| POST | Schedule Room | /room/schedule |
+---------+---------+-------------------+
| DEL  | Auth Room     | /room/auth     |
+---------+---------+-------------------+

Create a Room
^^^^^^^^^^^^^

Creates a room in a mongodb
::

  {
      "roomName": "castle",
      "createdBy": "kyritzb@gmail.com",
      "password": "helloWorld",
      "members": []
  }