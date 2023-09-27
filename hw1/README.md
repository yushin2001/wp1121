# Web Programming HW#1

## Run the project
If you only want to run the project, you can follow the steps below.

### 1. Clone the project

```bash
git clone https://github.com/yushin2001/wp1121.git
```


### 2. Install dependencies

```bash
cd backend
yarn
```

### 3. MongoDB setup

1. Copy the connection string.
2. Create `backend/.env` file and add the following line in the file

```bash
MONGO_URL=<your connection string>
```

3. Install dependencies

```bash
cd backend
yarn add mongoose
```

### 4. Run the server

```bash
yarn start
```

### 5. Open the frontend

Open `frontend/index.html` by clicking it in your file explorer.


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