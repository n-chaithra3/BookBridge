# BookBridge — Campus Second-Hand Book Exchange

> "Pass It On. Read It Again."

BookBridge is a simple full-stack web app where college students can list their used textbooks and other students can find and request them.

## Features
- Register and login (JWT authentication, passwords hashed with bcryptjs)
- Browse books with search and filters (department, semester, condition)
- Sell a book: add a listing with price and condition
- Send a buy request; seller accepts or rejects; accepted books are marked **Sold**
- My Requests page showing request status (Pending / Sold / Rejected)
- Admin-only route to view all listings, and admin can remove any listing

## Technologies
| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla JS) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Security | JWT, bcryptjs |
| Tools | Git, GitHub, VS Code |

## Setup
1. Install [Node.js](https://nodejs.org) and [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Install packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and change the values if needed.
4. (Optional) Add demo data:
   ```bash
   npm run seed
   ```
   Demo login: `arjun@college.edu` / `password123` (admin: `admin@college.edu` / `password123`)
5. Start the app:
   ```bash
   npm start
   ```
   Open http://localhost:3000

## Scripts
| Command | Description |
|---|---|
| `npm start` | Start the server |
| `npm run seed` | Add demo users and books (development only) |
| `npm test` | Run API tests with an in-memory MongoDB |

## API highlights
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server and database status |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/books` | List available books (with filters) |
| POST | `/api/books` | Add a listing (login required) |
| DELETE | `/api/books/:id` | Remove a listing (seller or admin) |
| GET | `/api/books/all` | All listings (admin only) |
| POST | `/api/requests` | Request to buy a book |
| GET | `/api/requests/mine` | My sent and received requests |
| PATCH | `/api/requests/:id` | Accept or reject a request (seller) |

## Project structure
```
BookBridge/
├── client/
│   ├── index.html, books.html, login.html, sell.html, requests.html
│   ├── css/style.css
│   └── js/api.js, js/books.js
├── server/
│   ├── app.js, server.js, seed.js
│   ├── models/ (User.js, Book.js, Request.js)
│   ├── routes/ (auth.js, books.js, requests.js)
│   └── middleware/auth.js
├── tests/api.test.js
├── .env.example
└── package.json
```
