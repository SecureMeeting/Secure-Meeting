Rest Apis
+++++++++

.. image:: /pics/rest.png
    :width: 600px
    :align: center
    :height: 320px
    :alt: microservices

Whats a Rest Api?
^^^^^^^^^^^^^^^^^
An API is an application programming interface - in short, it’s a set of rules that lets programs 
talk to each other, exposing data and functionality across the internet in a consistent format.

REST stands for Representational State Transfer. This is an architectural pattern that describes
how distributed systems can expose a consistent interface. When people use the term ‘REST API,’ 
they are generally referring to an API accessed via HTTP protocol at a predefined set of URLs.

These URLs represent various resources - any information or content accessed at that location, 
which can be returned as JSON, HTML, audio files, or images. Often, resources have one or more 
methods that can be performed on them over HTTP, like GET, POST, PUT and DELETE.

Secure-Meeting, for example, provides many separate REST APIs for sending messages, making calls, 
Creating accounts, managing your accounts, and a whole lot more. In Secure-Meetings' ecosystem, 
each part of the product has is its own API, but you will work with each of them in roughly the same way, 
whether over HTTP or using Websockets.

Api Authentication
^^^^^^^^^^^^^^^^^^

In order to authenticate api requests, Secure Meeting uses Json Web Tokens. 
JSON Web Token is an Internet standard for creating data with optional
signature and/or optional encryption whose payload holds JSON that asserts
some number of claims.

In order for a client to obtain these tokens to make futher requests, they must either login or create an account.
These requests both return an authentication token when successfully completed. These tokens are saved in the client's
local storage and used in later requests. 

Api Responses
^^^^^^^^^^^^^

To ensure a standard response across the variety Secure Meeting microservices, we use a very simple response object for every api request.

The response object is shown below.

Response
::
  class Response 
  {
      constructor(isSuccess, errorName, payload) 
      {
          this.isSuccess = isSuccess;
          this.errorName = errorName;
          this.payload = payload;
      }
  }


Attributes
""""""""""
``isSuccess`` *boolean*
  If the request was succesful.

``errorName`` *string*
  The kind of error the server had.

``payload`` *object*
  The data to be returned.

