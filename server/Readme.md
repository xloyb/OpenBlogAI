# API Documentation for Next.js Client

This document outlines the authentication API endpoints provided by an Express.js server using Prisma and JWT-based authentication. It is designed to help Next.js developers integrate with the server for user registration, login, token refresh, logout, and protected route access.

---

## Base URL

All authentication endpoints are mounted under `/api/auth`. Thus, the full URL for each endpoint starts with `/api/auth/`.

---

## Authentication Overview

The server uses JSON Web Tokens (JWT) for authentication:
- **Access Token:** Short-lived (15 minutes), used to authenticate requests to protected routes.
- **Refresh Token:** Long-lived (7 days), used to obtain new access tokens without re-authentication.

---

## Endpoints

### 1. Register User

- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Description:** Registers a new user and returns authentication tokens.
- **Request Body:**
  ```json
  {
    "email": "string",  // Required
    "password": "string" // Required
  }
  ```
- **Response:**
  - **201 Created:**
    ```json
    {
      "message": "User registered successfully",
      "accessToken": "string",
      "refreshToken": "string",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "isAdmin": "boolean",
        "isModerator": "boolean",
        "isVerifiedPoster": "boolean",
        "isBlocked": "boolean"
      }
    }
    ```
  - **400 Bad Request:** Missing email or password
    ```json
    { "error": "Email and password are required" }
    ```
  - **409 Conflict:** Email already registered
    ```json
    { "error": "User already exists" }
    ```

### 2. Login User

- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Description:** Authenticates a user and returns tokens.
- **Request Body:**
  ```json
  {
    "email": "string",  // Required
    "password": "string" // Required
  }
  ```
- **Response:**
  - **200 OK:**
    ```json
    {
      "message": "Login successful",
      "accessToken": "string",
      "refreshToken": "string",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "isAdmin": "boolean",
        "isModerator": "boolean",
        "isVerifiedPoster": "boolean",
        "isBlocked": "boolean"
      }
    }
    ```
  - **400 Bad Request:** Missing email or password
    ```json
    { "error": "Email and password are required" }
    ```
  - **401 Unauthorized:** Incorrect credentials
    ```json
    { "error": "Invalid email or password" }
    ```
  - **403 Forbidden:** Account blocked
    ```json
    { "error": "Your account is blocked" }
    ```
- **Note:** Rate-limited to **2 attempts per 15 minutes**. Exceeding this returns:
  ```json
  { "message": "Too many login attempts, try again later in 15 Minutes." }
  ```

### 3. Refresh Token

- **Method:** `POST`
- **URL:** `/api/auth/refresh`
- **Description:** Uses a refresh token to get a new access token and refresh token.
- **Headers:**
  - `Authorization: Bearer <refresh_token>`
- **Request Body:** None
- **Response:**
  - **200 OK:**
    ```json
    {
      "accessToken": "string",
      "refreshToken": "string"
    }
    ```
  - **401 Unauthorized:** Missing or invalid header
    ```json
    { "error": "Authorization header missing or invalid" }
    ```
  - **403 Forbidden:** Invalid/expired token or blocked account
    ```json
    { "error": "Invalid or expired refresh token" }
    ```
    or
    ```json
    { "error": "Your account is blocked" }
    ```

### 4. Logout User

- **Method:** `POST`
- **URL:** `/api/auth/logout`
- **Description:** Revokes the refresh token to log out.
- **Headers:**
  - `Authorization: Bearer <refresh_token>`
- **Request Body:** None
- **Response:**
  - **200 OK:**
    ```json
    { "message": "Logged out successfully" }
    ```
  - **400 Bad Request:** Missing token
    ```json
    { "error": "Refresh token missing" }
    ```
  - **500 Internal Server Error:** Logout failure
    ```json
    { "error": "Failed to log out" }
    ```

---

## Protected Routes

For endpoints requiring authentication, include the access token in the header:

```
Authorization: Bearer <access_token>
```

- **401 Unauthorized:** Invalid/expired/missing token
  ```json
  { "error": "Invalid or expired token" }
  ```
- **403 Forbidden:** Blocked user or insufficient permissions (e.g., admin-only routes)
  ```json
  { "error": "Your account is blocked" }
  ```
  or
  ```json
  { "error": "Admin access required" }
  ```

### Example Request

```javascript
fetch('/api/protected', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Token Management

- **Access Token:** Expires in 15 minutes. Use for protected routes.
- **Refresh Token:** Expires in 7 days. Use to refresh access tokens.

### Workflow

1. **Store Tokens:** Use HTTP-only cookies or secure local storage.
2. **Refresh Tokens:** On 401 errors, call `/api/auth/refresh` with the refresh token, then retry the request.
3. **Handle Expiration:** If refresh fails, redirect to login.

### Example Code

```javascript
async function fetchProtectedData(accessToken, refreshToken) {
  let res = await fetch('/api/protected', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (res.status === 401) {
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${refreshToken}` }
    });
    if (refreshRes.ok) {
      const { accessToken: newAccess, refreshToken: newRefresh } = await refreshRes.json();
      accessToken = newAccess;
      refreshToken = newRefresh;
      res = await fetch('/api/protected', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
    } else {
      window.location.href = '/login';
    }
  }
  return res.json();
}
```

---

## Error Handling

Handle these status codes:
- **400:** Invalid request
- **401:** Authentication failure
- **403:** Permission denied
- **409:** Resource conflict
- **429:** Rate limit exceeded
- **500:** Server error

Display user-friendly messages and retry with a new token on 401 errors.

---

## Security Considerations

- Use HTTPS for all requests.
- Store tokens securely (HTTP-only cookies preferred).
- Validate inputs client-side.
- Inform users of login rate limits.

--- 
