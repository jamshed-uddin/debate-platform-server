### Open Debate server - An online debate platform

- Client repository: [https://github.com/jamshed-uddin/debate-platform-client](https://github.com/jamshed-uddin/debate-platform-client)
- live demo: [https://opendebate.vercel.app/](https://opendebate.vercel.app/)

## Tech stack

- Node js (Express js)
- MongoDB + Mongoose
- JWT
- Bscrypt js
- Joi

## Run Locally

**Clone the repository**

```bash
git clone https://github.com/jamshed-uddin/debate-platform-server.git

```

**Change directory**

```bash
cd debate-platform-server
```

**Install packages**

```bash
npm install
```

**Set environment variables**

```env
DB_URI= your mongodb uri
PORT=8000
SECRET= any secret key
```

**Start the app**

```bash
npm run dev
```

## Dependencies

```json
"dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.0",
    "express": "^5.1.0",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.16.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }

```
