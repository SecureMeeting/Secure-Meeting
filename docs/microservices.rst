Microservices
+++++++++++++

Microservices is an architectural style that structures an application as a collection of services that are

- Highly maintainable and testable
- Loosely coupled
- Independently deployable
- Organized around business capabilities
- Owned by a small team
- The microservice architecture enables the rapid, frequent and reliable delivery of large, complex applications. It also enables an organization to evolve its technology stack.

.. image:: /pics/microservice.png
    :width: 850px
    :align: center
    :height: 432px
    :alt: microservices


Each of these microservice is located in its own folder within the "Secure-Meeting" github repo: https://github.com/SecureMeeting/Secure-Meeting

Each of these api microservices contains a folder for

- __test__ contains jest unit tests
- certs contains a fullchain.pem and a privkey.pem file
- config contains a db.js to connect to a mongodb
- controllers contains the main logic for each endpoint
- middleware contains middleware
- models contains mongodb schemas and javascript objects
- routes maps out the api routes

Each of these microservices also contains a

- server.js
- Dockerfile
- config.js
- jest.config.js
- .env

.ENV
^^^^

Each microservice needs a .env file in order to run. Below is an example of a valid .env file

::

  MONGO_URL=mymongourl
  PORT=8080
  COLLECTION_NAME=Users
  DB_NAME=Users
  SALT_ROUNDS=10
  SECRET_KEY=launchpad2022

Unit tests
^^^^^^^^^^

Each microservice has a folder named " __test__ " which contains multiple files ending in .test.js
Each of these files will be run when the command "npm test" is run in the command line.
The unit tests are made with jest

How to run unit tests:

- Running all tests in the project:
  ``npm test``
- Running specific tests:
  ``node <path-to-jest> -i <you-test-file> -c <jest-config> -t "<test-block-name>"``