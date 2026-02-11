## API Endpoints

### 1. **Health Check**
- **URL:** `/health`
- **Method:** `GET`
- **Description:** Checks the status of the API service.
- **Response:**
  ```json
  {
    "status": "active",
    "service": "HealthGuard Vision API"
  }
  ```

---

### 2. **Re-Authenticate User**
- **URL:** `/re-auth`
- **Method:** `POST`
- **Authentication:** JWT Required
- **Description:** Generates a new access token for the authenticated user.
- **Response:**
  ```json
  {
    "token": "newly_generated_jwt_token"
  }
  ```

---

### 3. **Sign Up**
- **URL:** `/signup`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstname": "John",
    "lastname": "Doe",
    "sex": "M"
  }
  ```
- **Response:**
  - **Success:**
    ```json
    {
      "message": "User created successfully"
    }
    ```
  - **Error (e.g., missing fields):**
    ```json
    {
      "error": "Missing required fields"
    }
    ```

---

### 4. **Predict**
- **URL:** `/predict`
- **Method:** `POST`
- **Authentication:** JWT Required
- **Description:** Analyzes an uploaded image based on the specified analysis type.
- **Request:**
  - **Form Data:**
    - `image`: The image file to analyze.
    - `type`: The type of analysis (`eye`, `skin`, `nail`).
- **Response:**
  - **Success:**
    ```json
    {
      "result": "analysis_result"
    }
    ```
  - **Error (e.g., missing image):**
    ```json
    {
      "error": "Aucune image envoyée"
    }
    ```

---

### 5. **Authenticate User**
- **URL:** `/auth`
- **Method:** `POST`
- **Description:** Authenticates a user and generates a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  - **Success:**
    ```json
    {
      "token": "jwt_token"
    }
    ```
  - **Error:**
    ```json
    {
      "error": "Invalid email or password"
    }
    ```

---

### 6. **Get All Users**
- **URL:** `/users`
- **Method:** `GET`
- **Authentication:** JWT Required
- **Description:** Retrieves a list of all users.
- **Response:**
  ```json
  [
    {
      "email": "user1@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "sex": "M"
    },
    {
      "email": "user2@example.com",
      "firstname": "Jane",
      "lastname": "Doe",
      "sex": "F"
    }
  ]
  ```