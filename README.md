## Facial recognition API

A RESTful API created using Node.js, Express, and bcrypt. The api provides the following functionality"

## Registration
API accepts name, email, and password from a registration form via a POST request, uses bcrypt to create a password-hash, and then stores the name, email, and password-hash in a PostgreSQL database.

## Login
API accepts email and password via a POST request, converts the password into a hash using bcrypt, searches the PostgreSQL database for a user with the same email address, then finally verifies if the user-submitted password-hash matches the stored password-hash. If successful, the API returns the user information (name, email, and score) to the front-end. 

## URL Submission
API accepts URL submissions from the front-end via a PUT request. The URL is sent to an external machine learning library via a fetch request. The external API returns a facial recogniation object, which is parsed and then returned to the front end as a promise. 
