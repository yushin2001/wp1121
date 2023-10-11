# Web Programming HW#2

## Run the app

Follow the instructions in this section to run the app locally.

### 1. setup backend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
cd backend
cp .env.example .env
```

Then, fill in the `MONGO_URL` field in `.env` with your MongoDB connection string and fill in the `PORT` field with the port you want to use. After that, you're `.env` file should look like this. 

```bash
PORT=8000
MONGO_URL=<your connection string>
```

### 2. setup frontend `.env`

Start by copying the `.env.example` file to `.env`.

```bash
cd frontend
cp .env.example .env
```

Then, fill in the `VITE_API_URL` field in `.env` with the url of your backend server. After that, you're `.env` file should look like this. Note that the port should be the same as the one you set in the backend `.env` file.

```bash
VITE_API_URL="http://localhost:8000/api"
```

### 3. start the backend server

```bash
cd backend
yarn
yarn dev
```

### 4. start the frontend server

```bash
cd frontend
yarn
yarn dev
```

Visit `http://localhost:5173` to see the app in action. That's it, you're done!

## Linter checks

If you only want to do linter checks, you can follow the steps below.

### 1. Backend linter check

```bash
cd backend
yarn
yarn lint
```

### 2. Frontend linter check

```bash
cd frontend
yarn
yarn lint
```