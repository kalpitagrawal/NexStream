# 🎬 NexStream — Video Hosting API

A **production-oriented REST API** for a video hosting platform (similar to YouTube), built with Node.js, Express 5, MongoDB, and Cloudinary. Features complete user authentication, video management, social interactions (likes, comments, subscriptions), playlists, and a channel analytics dashboard.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)

---

## ✨ Key Features

| Category | Features |
|---|---|
| **🔐 Authentication** | JWT access + refresh tokens, bcrypt password hashing, secure HTTP-only cookies |
| **📹 Video Management** | Upload, CRUD, pagination, text search, view tracking, publish toggle |
| **💬 Social** | Comments (CRUD + pagination), Likes (toggle on videos/comments/tweets), Subscriptions |
| **📋 Playlists** | Create, manage, add/remove videos with ownership checks |
| **📝 Tweets** | Community posts (CRUD) with owner verification |
| **📊 Dashboard** | Channel stats (total views, subscribers, likes, videos) |
| **🛡️ Security** | Helmet security headers, tiered rate limiting, Zod input validation |
| **📄 Documentation** | Interactive Swagger/OpenAPI docs at `/api-docs` |
| **🐳 Docker** | Dockerfile + Docker Compose with MongoDB |
| **☁️ Cloud** | Cloudinary integration for media storage with automatic cleanup |

---

## 🏗️ Architecture

```
src/
├── controllers/        # Business logic (9 controllers)
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── subscription.controller.js
│   ├── tweet.controller.js
│   ├── playlist.controller.js
│   ├── dashboard.controller.js
│   └── healthcheck.controller.js
├── models/             # Mongoose schemas (7 models)
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── subscription.model.js
│   ├── tweet.model.js
│   └── playlist.model.js
├── routes/             # Express route definitions (9 route files)
├── middlewares/        # Auth, file upload, rate limiting, validation
│   ├── auth.middleware.js          # JWT verification
│   ├── multer.middleware.js        # File upload handling
│   ├── rateLimiter.middleware.js   # Tiered rate limiting
│   └── validate.middleware.js      # Zod schema validation
├── validators/         # Zod validation schemas
│   └── schemas.js
├── utils/              # Shared utilities
│   ├── ApiError.js     # Custom error class
│   ├── ApiResponse.js  # Standardized response wrapper
│   ├── asyncHandler.js # Async error wrapper
│   ├── cloudinary.js   # Upload & delete from Cloudinary
│   └── swagger.js      # OpenAPI configuration
├── db/                 # Database connection
├── app.js              # Express app setup & middleware
├── index.js            # Server entry point
└── constants.js        # App constants
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account ([sign up free](https://cloudinary.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/kalpitagrawal/NexStream.git
cd NexStream

# Install dependencies
npm install

# Create environment file
cp .env.sample .env
# Edit .env with your credentials
```

### Configuration

Edit `.env` with your credentials:

```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
CORS_ORIGIN=*
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ACCESS_TOKEN_SECRET=your-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-secret
REFRESH_TOKEN_EXPIRY=10d
```

### Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

### Docker

```bash
# Build and run with Docker Compose
docker compose up -d

# The API will be available at http://localhost:8000
# MongoDB runs at localhost:27017
```

---

## 📚 API Documentation

Once the server is running, visit **[http://localhost:8000/api-docs](http://localhost:8000/api-docs)** for interactive Swagger documentation.

### API Endpoints Overview

#### 🔐 Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users/register` | Register with avatar upload |
| `POST` | `/api/v1/users/login` | Login (returns JWT tokens) |
| `POST` | `/api/v1/users/logout` | Logout (clears cookies) |
| `POST` | `/api/v1/users/refresh-token` | Refresh access token |
| `POST` | `/api/v1/users/change-password` | Change password |

#### 👤 User Profile
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/users/current-user` | Get current user profile |
| `PATCH` | `/api/v1/users/update-account` | Update name & email |
| `PATCH` | `/api/v1/users/avatar` | Update avatar (deletes old from Cloudinary) |
| `PATCH` | `/api/v1/users/cover-image` | Update cover image |
| `GET` | `/api/v1/users/c/:username` | Get channel profile + subscriber count |
| `GET` | `/api/v1/users/watch-history` | Get watch history |

#### 📹 Videos
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/videos` | List videos (paginated, searchable, sortable) |
| `POST` | `/api/v1/videos` | Publish video (upload video + thumbnail) |
| `GET` | `/api/v1/videos/:videoId` | Get video (increments views) |
| `PATCH` | `/api/v1/videos/:videoId` | Update video details |
| `DELETE` | `/api/v1/videos/:videoId` | Delete video + Cloudinary cleanup |
| `PATCH` | `/api/v1/videos/toggle/publish/:videoId` | Toggle publish status |

#### 💬 Comments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/comments/:videoId` | Get video comments (paginated) |
| `POST` | `/api/v1/comments/:videoId` | Add comment |
| `PATCH` | `/api/v1/comments/c/:commentId` | Update comment |
| `DELETE` | `/api/v1/comments/c/:commentId` | Delete comment |

#### ❤️ Likes
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/likes/toggle/v/:videoId` | Toggle video like |
| `POST` | `/api/v1/likes/toggle/c/:commentId` | Toggle comment like |
| `POST` | `/api/v1/likes/toggle/t/:tweetId` | Toggle tweet like |
| `GET` | `/api/v1/likes/videos` | Get all liked videos |

#### 🔔 Subscriptions
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/subscriptions/c/:channelId` | Toggle subscription |
| `GET` | `/api/v1/subscriptions/c/:channelId/subscribers` | Get channel subscribers |
| `GET` | `/api/v1/subscriptions/u/:subscriberId/channels` | Get subscribed channels |

#### 📝 Tweets (Community Posts)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/tweets` | Create tweet |
| `GET` | `/api/v1/tweets/user/:userId` | Get user tweets |
| `PATCH` | `/api/v1/tweets/:tweetId` | Update tweet |
| `DELETE` | `/api/v1/tweets/:tweetId` | Delete tweet |

#### 📋 Playlists
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/playlist` | Create playlist |
| `GET` | `/api/v1/playlist/:playlistId` | Get playlist with videos |
| `PATCH` | `/api/v1/playlist/:playlistId` | Update playlist |
| `DELETE` | `/api/v1/playlist/:playlistId` | Delete playlist |
| `PATCH` | `/api/v1/playlist/add/:videoId/:playlistId` | Add video to playlist |
| `PATCH` | `/api/v1/playlist/remove/:videoId/:playlistId` | Remove video from playlist |
| `GET` | `/api/v1/playlist/user/:userId` | Get user playlists |

#### 📊 Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/dashboard/stats` | Channel stats (views, subscribers, likes) |
| `GET` | `/api/v1/dashboard/videos` | All channel videos with likes count |

---

## 🛡️ Security Features

- **Helmet** — Sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- **Rate Limiting** — Tiered rate limiters:
  - Auth routes: 10 requests / 15 min (prevents brute-force)
  - Write operations: 30 requests / 15 min (prevents spam)
- **JWT Authentication** — Access token (short-lived) + Refresh token (long-lived) strategy
- **Input Validation** — Zod schemas with detailed error messages for all endpoints
- **Password Security** — bcrypt hashing with salt rounds
- **Secure Cookies** — HTTP-only, secure flags on auth cookies
- **Ownership Checks** — All update/delete operations verify resource ownership

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM with aggregation pipelines |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Cloudinary** | Media storage (videos, images) |
| **Multer** | File upload handling |
| **Zod** | Request validation |
| **Helmet** | Security headers |
| **express-rate-limit** | Rate limiting |
| **Swagger** | API documentation |
| **Docker** | Containerization |

---

## 📝 Data Models

```mermaid
erDiagram
    USER ||--o{ VIDEO : uploads
    USER ||--o{ COMMENT : writes
    USER ||--o{ LIKE : gives
    USER ||--o{ TWEET : posts
    USER ||--o{ PLAYLIST : creates
    USER ||--o{ SUBSCRIPTION : subscribes
    VIDEO ||--o{ COMMENT : has
    VIDEO ||--o{ LIKE : receives
    PLAYLIST ||--o{ VIDEO : contains
    TWEET ||--o{ LIKE : receives
    COMMENT ||--o{ LIKE : receives
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

**Built by [Kalpit Agrawal](https://github.com/kalpitagrawal)** 🚀
