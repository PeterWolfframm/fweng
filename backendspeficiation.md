# API Endpoints Overview for Frontend Application

## Base Configuration

**Base URL:** `http://localhost:8080/api`

**CORS Enabled Origins:**

- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:4200`

---

## Authentication Flow

### 1. **POST** `/api/auth/login`

**Purpose:** User login and JWT token retrieval

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (Success - 200):**

```json
{
  "message": "Login successful",
  "userId": "uuid",
  "username": "string",
  "token": "string (JWT)"
}
```

**Response (Failure - 401):**

```json
{
  "message": "Invalid email or password",
  "userId": null,
  "username": null,
  "token": null
}
```

**How to Access:** Public endpoint, no authentication required.

---

## Using the JWT Token

After successful login, include the JWT token in all protected endpoint requests:

```
Authorization: Bearer <token>
```

---

## User Endpoints (`/api/users`)

### 2. **POST** `/api/users`

**Purpose:** Create new user (registration)

**Request Body:**

```json
{
  "username": "string (4-16 chars)",
  "email": "string",
  "password": "string (8-15 chars, must contain uppercase, lowercase, digit, special char)"
}
```

**Response:**

```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Access:** Public endpoint.

---

### 3. **GET** `/api/users/me`

**Purpose:** Get current authenticated user's profile

**Response:**

```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Access:** Requires JWT token. Returns 401 if not authenticated.

---

### 4. **GET** `/api/users`

**Purpose:** Get all users

**Response:** Array of UserDto objects

**Access:** Requires JWT token + ADMIN role.

---

### 5. **GET** `/api/users/{id}`

**Purpose:** Get specific user by ID

**Response:** UserDto object

**Access:** Requires JWT token. User can read their own profile or ADMIN can read any.

---

### 6. **PUT** `/api/users/{id}`

**Purpose:** Update user profile

**Request Body:**

```json
{
  "username": "string (4-16 chars, optional)",
  "email": "string (optional)",
  "password": "string (8-15 chars with complexity requirements, optional)"
}
```

**Response:** Updated UserDto object

**Access:** Requires JWT token. User can update their own profile or ADMIN can update any.

---

### 7. **DELETE** `/api/users/{id}`

**Purpose:** Delete user

**Access:** Requires JWT token. User can delete their own account or ADMIN can delete any.

---

## Post Endpoints (`/api/posts`)

### 8. **POST** `/api/posts`

**Purpose:** Create a new post

**Request Body:**

```json
{
  "title": "string (3-30 chars)",
  "body": "string (3-100 chars)"
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "string",
  "body": "string",
  "createdAt": "timestamp"
}
```

**Access:** Requires JWT token. Post will be associated with authenticated user.

---

### 9. **GET** `/api/posts/my-posts`

**Purpose:** Get all posts created by the authenticated user

**Response:** Array of PostDto objects

**Access:** Requires JWT token.

---

### 10. **GET** `/api/posts`

**Purpose:** Get all posts

**Response:** Array of PostDto objects

**Access:** Requires JWT token + ADMIN role.

---

### 11. **GET** `/api/posts/{id}`

**Purpose:** Get specific post by ID

**Response:** PostDto object

**Access:** Requires JWT token + ADMIN role.

---

### 12. **PUT** `/api/posts/{id}`

**Purpose:** Update a post

**Request Body:**

```json
{
  "title": "string (3-30 chars)",
  "body": "string (3-100 chars)"
}
```

**Response:** Updated PostDto object

**Access:** Requires JWT token. User can update their own posts or ADMIN can update any.

---

### 13. **DELETE** `/api/posts/{id}`

**Purpose:** Delete a post

**Access:** Requires JWT token. User can delete their own posts or ADMIN can delete any.

---

## Group Endpoints (`/api/groups`)

### 14. **POST** `/api/groups`

**Purpose:** Create a new group

**Request Body:**

```json
{
  "name": "string (5-15 chars)"
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "string",
  "createdById": "uuid",
  "createdByUsername": "string"
}
```

**Access:** Requires JWT token. Group will be created by authenticated user.

---

### 15. **GET** `/api/groups`

**Purpose:** Get all groups

**Response:** Array of GroupDto objects

**Access:** Public endpoint (no authentication required).

---

### 16. **GET** `/api/groups/my-groups`

**Purpose:** Get groups the authenticated user belongs to

**Response:** Array of GroupDto objects

**Access:** Requires JWT token.

---

### 17. **GET** `/api/groups/{id}`

**Purpose:** Get specific group by ID

**Response:** GroupDto object

**Access:** Requires JWT token. User must be a member of the group or be ADMIN.

---

### 18. **POST** `/api/groups/{id}/members`

**Purpose:** Add a member to a group

**Request Body:**

```json
{
  "userId": "uuid"
}
```

**Response:** Updated GroupDto object

**Access:** Requires JWT token + ADMIN role.

---

### 19. **GET** `/api/groups/memberships`

**Purpose:** Get overview of all user-group memberships

**Response:** Array of UserGroupViewDto objects

**Access:** Requires JWT token + ADMIN role.

---

### 20. **PUT** `/api/groups/{id}`

**Purpose:** Update a group

**Request Body:**

```json
{
  "name": "string (5-15 chars)"
}
```

**Response:** Updated GroupDto object

**Access:** Requires JWT token. User can update groups they created or ADMIN can update any.

---

### 21. **DELETE** `/api/groups/{id}`

**Purpose:** Delete a group

**Access:** Requires JWT token + ADMIN role.

---

## Group Posts Endpoints (`/api/groupposts`)

### 22. **POST** `/api/groupposts/{groupId}/posts`

**Purpose:** Create a post in a group

**Request Body:**

```json
{
  "groupId": "uuid",
  "postId": "uuid"
}
```

**Response:**

```json
{
  "id": "uuid",
  "groupId": "uuid",
  "postId": "uuid"
}
```

**Access:** Requires JWT token.

---

### 23. **GET** `/api/groupposts`

**Purpose:** Get all group posts

**Response:** Array of GroupPostDto objects

**Access:** Public endpoint.

---

### 24. **GET** `/api/groupposts/{id}`

**Purpose:** Get specific group post by ID

**Response:** GroupPostDto object

**Access:** Public endpoint.

---

### 25. **PUT** `/api/groupposts/{id}`

**Purpose:** Update a group post

**Request Body:**

```json
{
  "groupId": "uuid",
  "postId": "uuid"
}
```

**Response:** Updated GroupPostDto object

**Access:** Requires JWT token + ADMIN role.

---

### 26. **DELETE** `/api/groupposts/{id}`

**Purpose:** Delete a group post

**Access:** Requires JWT token + ADMIN role.

---

## Error Handling

All endpoints return standard HTTP status codes:

- **200:** Success
- **401:** Unauthorized (missing or invalid token)
- **403:** Forbidden (insufficient permissions)
- **404:** Resource not found

Error responses include:

```json
{
  "message": "Error description",
  "errors": ["validation errors if any"],
  "stackTrace": "detailed stack trace (in development)"
}
```

---

## Summary of Access Patterns

**Public Endpoints (no auth required):**

- POST `/api/auth/login` - Login
- POST `/api/users` - Register
- GET `/api/groups` - List all groups
- GET `/api/groupposts` - List all group posts
- GET `/api/groupposts/{id}` - Get group post by ID

**Authenticated User Endpoints (JWT required):**

- GET `/api/users/me` - Get own profile
- GET `/api/users/{id}` - Get user (own or if member of same group)
- PUT `/api/users/{id}` - Update own profile
- DELETE `/api/users/{id}` - Delete own account
- POST `/api/posts` - Create post
- GET `/api/posts/my-posts` - Get own posts
- PUT `/api/posts/{id}` - Update own post
- DELETE `/api/posts/{id}` - Delete own post
- POST `/api/groups` - Create group
- GET `/api/groups/my-groups` - Get own groups
- GET `/api/groups/{id}` - Get group (if member)
- PUT `/api/groups/{id}` - Update own group
- POST `/api/groupposts/{groupId}/posts` - Create group post

**Admin Only Endpoints (JWT + ADMIN role required):**

- GET `/api/users` - List all users
- GET `/api/posts` - List all posts
- GET `/api/posts/{id}` - Get any post
- POST `/api/groups/{id}/members` - Add member to group
- GET `/api/groups/memberships` - Get all memberships
- DELETE `/api/groups/{id}` - Delete any group
- PUT `/api/groupposts/{id}` - Update any group post
- DELETE `/api/groupposts/{id}` - Delete any group post
