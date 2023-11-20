# Web Programming HW#4

## Running the app

### 1. Install dependencies

```bash
yarn install
```

### 2. Create `.env` file in the root directory

   ```text
        DATABASE_URL=
        NEXTAUTH_SECRET=
        NEXT_PUBLIC_PUSHER_APP_KEY=
        PUSHER_APP_ID=
        PUSHER_SECRET=
   ```

### 3. MongoDB setup

1. See this tutorial: https://youtu.be/O5cmLDVTgAs?si=CNNLtl9m7kX7GbFh (2:01:08 - 2:03:00)
2. Copy the connection string.
3. Add the connection string in `.env` file

   ```text
        DATABASE_URL=<your connection string>
   ```

*****
!!! Important !!!
Please replace "?" in your connection string with "%3F"
for example:
original connection string: mongodb+srv://username:password@cluster0.l2n8y0f.mongodb.net/?retryWrites=true&w=majority
after modifying: mongodb+srv://username:password@cluster0.l2n8y0f.mongodb.net/%3FretryWrites=true&w=majority
*****


### 4. Setup Pusher

1. Create a pusher account at https://pusher.com/

2.  Create a new app

    - Click `Get Started` or `Manage/Create app`on the `Channel` tab
    - Enter the app name
    - Select a cluster. Pick the one closest to you, i.e. `ap3(Asia Pacific (Tokyo))`
    - Click `Create app`

3.  Go to `App Keys` tab, you will see the following keys:

    - `app_id`
    - `key`
    - `secret`

4.  Copy these keys to your `.env` file:

    ```text
    NEXT_PUBLIC_PUSHER_APP_KEY=<key>
    PUSHER_APP_ID==<app_id>
    PUSHER_SECRET=<secret>
    ```

5.  Go to `App Settings` tab, scroll down to `Enable authorized connections` and enable it.

### 5. Setup Prisma

```bash
yarn prisma db push

```

### 6. Start the app

```bash
yarn dev
```

## Linter checks

If you only want to do linter checks, you can execute the code below.

```bash
yarn lint
```