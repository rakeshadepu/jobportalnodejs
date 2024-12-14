# Job Portal

A full-stack web application for job seekers and employers, enabling efficient job postings, applications, and management.

## Features
- **User Authentication**:
  - Secure user registration and login with JWT.
  - Password hashing using `bcryptjs`.

- **Rate Limiting**:
  - Protects the API from excessive requests using `express-rate-limit`.

- **Environment-Specific Configuration**:
  - Environment variables managed through `.env`.

## Technologies Used
### Backend:
- **Node.js**: Runtime environment.
- **Express.js**: Web framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: Object Data Modeling (ODM) library.
- **JWT**: Secure authentication.
- **bcryptjs**: Password hashing.
- **Validator**: Data validation.

### Additional Tools:
- **Swagger**: API documentation.
- **GitHub**: Version control.
---

## Installation and Setup

### Prerequisites
- Node.js and npm installed
- MongoDB server running
- A `.env` file with the following keys:
  ```
  MONGO_URI=your_mongo_db_connection_string
  JWT_SECRET=your_jwt_secret
  ```

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/rakeshadepu/jobportalnodejs.git
   cd jobportalnodejs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```
---

## API Endpoints
### **Authentication**
- `POST /register`: Register a new user.
- `POST /login`: Login and receive a JWT token.

### **Job Listings**
- `GET /jobs`: Get all job listings.
- `POST /jobs`: Create a new job listing (Employer only).
- `GET /jobs/:id`: Get job details by ID.
---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.
---

## License
This project is licensed under the MIT License.
---
