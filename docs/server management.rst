Server Management Api
+++++++++++++++++++++

In order to create a place to communicate, we need hardware for the call to take place on.
These servers are distributed across the world, and take place on both azure and aws. 
The flexibility of adding servers with an api request helps with scaling servers. These 
servers are chosen based on the signalling api. This api can also be used in a dashboard
in the future to add buttons to add, create, and list all servers and determine if they are up.

Base URL
^^^^^^^^

``www.api.securemeeting.org/server``   

Endpoints
^^^^^^^^^
+---------+---------+------------------------+
| POST   Create Servers     /server/create   |
+---------+---------+------------------------+
| GET    Get Servers        /server/get      |
+---------+---------+------------------------+
| GET    Get All Servers    /server/getAll   |
+---------+---------+------------------------+
| DEL    Delete Servers     /server/delete   |
+---------+---------+------------------------+

.env
^^^^^^^^^^

::

  MONGO_URL=mymongourl
  PORT=8080
  COLLECTION_NAME=Users
  DB_NAME=Users
  SALT_ROUNDS=10
  SECRET_KEY=launchpad2022

Server Model
^^^^^^^^^^^^

A server is a device where calls take place on. These records keep track of all of our servers.

::

  {
      "_id": {
          "$oid": "5f63b58e195810f8c1908606"
      },
      "country": "US",
      "region": "US-East3",
      "ip": "192.168.1.1",
      "type": "SFU",
      "timeCreated": "2020-09-17T15:13:44-04:00",
      "__v": {
          "$numberInt": "0"
      }
  }


Attributes
""""""""""
``_id`` *string*
  Unique identifier for the object.

``country`` *string*
  The country where the server is.

``region`` *string*
The region in the country where the server is.

``timeCreated`` *string*
  A *moment.js* formatted time representing when the server was created.

``type`` *string*
  The type of media server it is. This can be either **SFU** or **MCU**.


Create a Server
^^^^^^^^^^^^^^^

Creates a server record in the mongodb. Does not allow duplicate ips.

``POST`` ``www.api.securemeeting.org/server/create``

Request
::

 {
    "country": "US",
    "region": "US-East3",
    "type": "SFU",
    "ip": "192.168.1.1"
 }


Get a Server
^^^^^^^^^^^^

Obtains a server record based on the ip.

``GET`` ``www.api.securemeeting.org/server/get``

Request
::

  {
      "ip": "192.168.1.1"
  }

Get all Servers
^^^^^^^^^^^^^^^

Obtains a server record based on the ip.

``GET`` ``www.api.securemeeting.org/server/getAll``

There is no request

Delete a Server
^^^^^^^^^^^^^^^

Deletes a server record based on the ip.

``DEL`` ``www.api.securemeeting.org/server/delete``

Request
::

  {
      "ip": "192.168.1.1"
  }


