🎵 DAW API - Digital Audio Workstation Backend
A RESTful API for managing Digital Audio Workstation projects, tracks, and audio clips with user authentication.

✨ Features
🔐 HTTP Basic Authentication

🎵 Project management (create, read, update, delete)

🎛️ Track management with multiple audio clips

🔊 Audio clip positioning and effects

📊 MongoDB for data storage

⚡ Redis for session management

📚 Interactive API documentation with Swagger

🛠 Technologies
Backend: Node.js, Express.js

Database: MongoDB

Cache: Redis

Authentication: HTTP Basic Auth + Redis tokens

Documentation: Swagger/OpenAPI 3.0

Hashing: SHA1

🚀 Installation
Prerequisites
Node.js (v18 or higher)

MongoDB

Redis

Setup Steps
Clone the repository

bash
git clone <repository-url>
cd FileManager_Daw
Install dependencies

bash
npm install
Set up environment variables
Create a .env file in the root directory:

env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/daw_db
REDIS_URL=redis://localhost:6379
BASE_URL=/api/v1
Start the services

bash
# Start MongoDB (make sure it's running)
sudo systemctl start mongod

# Start Redis
redis-server

# Start the application
npm run dev
Verify installation
Visit: http://localhost:3000/api-docs to see the API documentation.

📖 API Documentation
Interactive Documentation
The API provides interactive documentation using Swagger UI:

text
http://localhost:3000/api-docs
From here you can:

View all available endpoints

See request/response schemas

Test API calls directly

Download OpenAPI specification

🔐 Authentication
The API uses HTTP Basic Authentication for login, which returns a token for subsequent requests.

Authentication Flow
Register a new user account (no auth required)

Login using HTTP Basic Auth to get a token

Use token in x-auth header for protected endpoints

Logout to invalidate the token

Login with HTTP Basic Auth
For the login endpoint, use HTTP Basic Authentication:

http
Authorization: Basic <base64-encoded-credentials>
Where the credentials are encoded as:

text
base64(email:password)
Example:

http
Authorization: Basic dXNlckBleGFtcGxlLmNvbTpteXBhc3N3b3JkMTIz
Using the Token
After successful login, use the returned token in the x-auth header:

http
x-auth: <your-token>
Example:

http
x-auth: 123e4567-e89b-12d3-a456-426614174000
Tokens are valid for 24 hours.
