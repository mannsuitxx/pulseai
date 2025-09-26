
# PULSE AI - Backend

This is the backend for the PULSE AI application, a disaster preparedness platform.

## Setup and Run

### 1. Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```
MONGO_URI=mongodb://localhost:27017/pulse_ai
SECRET_KEY=your_secret_key
```

Replace `your_secret_key` with a strong, unique secret key.

### 2. Dependency Installation

Install the required Python packages using pip:

```
pip install -r requirements.txt
```

### 3. Start the Development Server

Run the Flask development server:

```
flask run
```

The backend server will start on `http://127.0.0.1:5000`.

### 4. Create the First Admin User

To create the first admin user, you can use a tool like Postman or curl to send a POST request to the `/register` endpoint to create a new user. Then, you will need to manually update the user's role to `admin` in the MongoDB database.

1. **Register a new user:**
   - **URL:** `http://127.0.0.1:5000/register`
   - **Method:** `POST`
   - **Body (raw, JSON):**
     ```json
     {
         "username": "admin",
         "password": "your_password"
     }
     ```

2. **Update the user role in MongoDB:**
   - Connect to your MongoDB database.
   - Open the `pulse_ai` database.
   - Open the `users` collection.
   - Find the user you just created and update the `role` field to `admin`.
