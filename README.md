# Lab Title: Build Simple RESTful Services using Express and MongoDB

## Domain: Dairy Management System

This project is a modern **Dairy Management System** built for college FSD laboratory evaluations. It demonstrates a complete transition from file-system-based data storage (`fs` and JSON files) to a structured database model using **Express.js**, **Mongoose**, and **MongoDB**. The existing green-and-white themed frontend UI remains completely unchanged, but the backend is refactored to use standard RESTful APIs and MongoDB.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database Mapping**: Mongoose ODM (Object Document Mapper)
- **Database**: MongoDB (Local database `dairy_management`)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Environment**: Dotenv for environment variable configuration

---

## 📂 Project Structure

```text
Dairy-Management/
│
├── server.js               # Main entry point (Express configuration & routing)
├── package.json            # NPM dependencies & running scripts
├── .env                    # Environment configurations (Port, MongoDB URI)
│
├── models/                 # Mongoose models for Database Schema definition
│   ├── Dairy.js            # Dairy Products Inventory Model
│   ├── Farmer.js           # Farmer details Model
│   ├── Collection.js       # Daily Milk Collection details Model
│   ├── Location.js         # Geolocation coordinate status Model
│   └── Registration.js     # User registration details Model
│
└── public/                 # Static files (Frontend UI)
    ├── index.html          # Approved UI Layout
    ├── style.css           # Vanilla CSS Styling (Approved theme)
    └── script.js           # Frontend JavaScript (Ajax & Fetch requests)
```

---

## 🚀 Setup & Execution Instructions

### 1. Start MongoDB
Ensure MongoDB is installed and running on your local machine.

* **On Windows**:
  Open Command Prompt / PowerShell and check status or start the service:
  ```powershell
  net start MongoDB
  ```
  *(Or verify it is running on the default local URI: `mongodb://127.0.0.1:27017`)*

### 2. Configure Environment Variables
A `.env` file should exist in the root folder of the project containing:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dairy_management
```

### 3. Install Dependencies
Run the command below in the project root to install mongoose, dotenv, cors, and other packages:
```bash
npm install
```

### 4. Start the Express Server
Launch the server using:
```bash
npm start
```
This will start the server on port `5000` (or the configured `PORT`). You should see:
```text
Dairy Management Server is running on port 5000
Access the application: http://localhost:5000
Connected to MongoDB successfully at: mongodb://127.0.0.1:27017/dairy_management
```

### 5. Access the Application
Open your web browser and navigate to:
```text
http://localhost:5000
```

---

## 🧪 REST API Endpoints

### 1. Dairy Inventory (Main CRUD Operations)

| HTTP Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/dairy` | Retrieve all dairy products | `200 OK` |
| **GET** | `/api/dairy/:id` | Retrieve a single dairy product by its MongoDB ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/dairy` | Add a new dairy product to inventory | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/dairy/:id` | Update an existing dairy product by ID | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/dairy/:id` | Delete a dairy product from inventory | `200 OK` / `404 Not Found` |

### 2. Auxiliary System API Endpoints

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/dashboard` | Get aggregate counts of Farmers, Collections, Products, and Location Status |
| **POST** | `/api/farmers` | Register a new farmer |
| **POST** | `/api/collections` | Log a milk collection entry |
| **POST** | `/api/location` | Save current geolocation status |
| **GET** | `/api/registrations` | Fetch all registered user accounts |
| **POST** | `/api/registrations`| Create a new user profile card (verifies unique username) |

---

## 📬 Postman Testing Reference

You can test the APIs in Postman using the specifications below.

### 1. Create a Dairy Record (POST)
- **URL**: `http://localhost:5000/api/dairy`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body (JSON)**:
  ```json
  {
    "name": "Milk",
    "quantity": 25,
    "price": 50.00
  }
  ```

### 2. Read All Dairy Records (GET)
- **URL**: `http://localhost:5000/api/dairy`
- **Method**: `GET`

### 3. Read a Particular Dairy Record (GET by ID)
- **URL**: `http://localhost:5000/api/dairy/<id_value>`
- **Method**: `GET`
  *(Replace `<id_value>` with the 24-character hexadecimal MongoDB `id` returned from the POST or GET request)*

### 4. Update an Existing Dairy Record (PUT)
- **URL**: `http://localhost:5000/api/dairy/<id_value>`
- **Method**: `PUT`
- **Headers**: `Content-Type: application/json`
- **Body (JSON)**:
  ```json
  {
    "name": "Milk",
    "quantity": 40,
    "price": 55.00
  }
  ```

### 5. Delete a Dairy Record (DELETE)
- **URL**: `http://localhost:5000/api/dairy/<id_value>`
- **Method**: `DELETE`
