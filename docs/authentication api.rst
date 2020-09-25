Authentication Api
++++++++++++++++++

In order to create a place to communicate, you must create a **ROOM**. 
Room Management deals with creating, updating, and deleting a room.
When a room is established a call can now take place in it.


Storing the Authentication Token
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When a user logs in or signs up, they are given an authentication token. This authentication has 
been signed by the server and contains a token which expires after a given amount of time. This 
authentication token needs to be saved locally in order to use it in future api requests.


Saving the token
^^^^^^^^^^^^^^^^

::

  const getJwt = async () => {
      const { data } = await axios.get(`${apiUrl}/jwt`);
      localStorage.setItem('token', data.token);
    };

Using the auth token
^^^^^^^^^^^^^^^^^^^^

To use an athentication token you must add it to the header in your api request.


Example
::

  let authToken = localStorage.getItem("auth_token");
    axios
      .get(urlEndpoint, {
        headers: { Authorization: "Bearer " + authToken },
      })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

``www.api.securemeeting.org/auth``   


Base URL
^^^^^^^^

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

``password`` *string*
  The password of the account, which is encrypted with bcrypt.

``firstName`` *string*
  The first name of the user.

``lastName`` *string*
  The last name of the user.

``emailedIsVerified`` *boolean*
  If the user's email is verified. If a user signed in with google oath, 

``emailVerification`` *string*
  The email verification code of the user which will be sent in an email.

``inviteCode`` *string*
  The invite code of the user.


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

Response
::

  {
      "isSuccess": true,
      "errorName": null,
      "payload": {
          "email": "kyritzb123@gmail.com",
          "password": "$2b$10$vxj5iqToM5iVaJNOyR6kMuD6z2nPkhclG7Nqu2zHMttYYFF9V8ylW",
          "firstName": "bry",
          "lastName": "kyr",
          "rooms": [],
          "emailedIsVerified": false,
          "emailVerification": "d4ac44e3-9b56-4753-ad0c-06fdf59b4697",
          "friends": [],
          "friendRequests": [],
          "timeCreated": "2020-09-25T01:01:34-04:00",
          "inviteCode": "wJzgOe",
          "invitedUsers": []
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNvcmQiOm51bGwsImlhdCI6MTYwMTAxMDA5NCwiZXhwIjoxNjAxMDk2NDk0fQ.Yidy-HxFfE8hXF9-E4A6SgMPMtSIxk7BTOXjnQSry_s"
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

Response
::

  {
      "isSuccess": true,
      "errorName": null,
      "payload": {
          "email": "kyritzb123@gmail.com",
          "password": "$2b$10$vxj5iqToM5iVaJNOyR6kMuD6z2nPkhclG7Nqu2zHMttYYFF9V8ylW",
          "firstName": "bry",
          "lastName": "kyr",
          "rooms": [],
          "emailedIsVerified": false,
          "emailVerification": "d4ac44e3-9b56-4753-ad0c-06fdf59b4697",
          "friends": [],
          "friendRequests": [],
          "timeCreated": "2020-09-25T01:01:34-04:00",
          "inviteCode": "wJzgOe",
          "invitedUsers": []
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWNvcmQiOm51bGwsImlhdCI6MTYwMTAxMDA5NCwiZXhwIjoxNjAxMDk2NDk0fQ.Yidy-HxFfE8hXF9-E4A6SgMPMtSIxk7BTOXjnQSry_s"
  }
