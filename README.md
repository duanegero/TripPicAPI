# TripPic API

This restful API is designed to handle requests made from TripPic frontend app, Postman, or CURL.

- [Installation](#installation)
- [Frontend Repository](#frontend)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Docker](#docker)
- [License](#license)

## Installation

1. Clone Repository:<br>
   `git clone https://github.com/duanegero/TripPicAPI.git`
2. Navigate to the Project Directory
3. Install Dependencies:<br>
   `npm install`
4. Start Server<br>
   `node index.js`

## Frontend

### React App

https://github.com/duanegero/TripPic-Frontend.git

## API Endpoints

- GET `imageRoute/:key` - Get a single image from s3 bucket and image details from database.
- GET `imageRoute/user/:id` - Get all image details by user ID.
- GET `usersRoute/:id` - Get user details by ID.
- POST `imagesRoute/` - Post a single image to s3 bucket and details to database.
- POST `usersRoute/` - Post a new user.
- POST `supportRoute/` - Post a new support request.
- POST `loginRoute/` - Post a login attempt.
- PUT `imagesRoute/:id` - Put new image details to database by ID.
- PUT `usersRoute/:id` - Put new user details to database by ID.
- DELETE `imagesRoute/:key` - Delete image from s3 bucket and details from database.
- DELETE `userRoute/:id` - Delete user from database.

## Usage

Once the server is running you can interact with the API through the available endpoints. Here is an example of how to upload a new image with `/imageRoutes` POST endpoint using Postman or any HTTP client:

### Example Request (POST `/imageRoutes`)

1. First login with valid user email and password to get jwt token

- POST `/loginRoute`

```
{
  "email": "user@email.here",
  "password": "userpasswordhere"
}
```

2. Make note of the jwt token and user ID that is returned in JSON.

3. Post to `/imagesRoute` with form-data Key/Value pairs in the body.

| Key     | Type | Value                     |
| ------- | ---- | ------------------------- |
| image   | File | upload from local machine |
| name    | Text | name of image             |
| user_id | Text | user ID from login        |

4. Add Authorization and Bearer < JWT TOKEN > to the Headers

5. Send and you should recieve a success JSON with image details

## Docker

## License

This project is licensed under the MIT License.
