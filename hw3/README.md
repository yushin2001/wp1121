# Web Programming HW#3

## Running the app

1. Install dependencies

```bash
yarn install
```

2. Make sure you have installed Docker

3. Make sure to clean your docker, in case the database cannot be spined up

4. Spin up the database

```bash
docker compose up -d
```

5. Create a `.env.local` file in the root of the project and add a _valid_ Postgres URL.

```bash
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/joinme"
```

6. Run the migrations

```bash
yarn migrate
```

7. Start the app

```bash
yarn dev
```