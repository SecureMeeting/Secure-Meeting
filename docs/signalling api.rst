Signalling Api
++++++++++++++

In order to create a place to communicate, you must create a **ROOM**. 
Room Management deals with creating, updating, and deleting a room.
When a room is established a call can now take place in it.

Base URL
^^^^^^^^^^^^^

``www.api.securemeeting.org``   


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