# Your Project Name

This is full stack event management web application.

## Prerequisites

- Node.js and npm (or yarn) installed on your machine.
- Link your mongodb locally via docker

## Getting Started

To get a local copy up and running follow these simple steps.

### Installation

1.  Clone the repo

    ```sh
    git clone https://github.com/Sadam-PK/event-management
    ```

2.  Install packages in client directory
    ```sh
    npm install
    ```
    ```sh
    npm install react-router-dom axios react-redux redux-thunk @reduxjs/toolkit react-query @heroicons/react react-toastify react-paginate react-loader-spinner moment react-loading-skeleton
    ```
3.  Install Tailwind CSS in client

    ```sh
    npm install -D tailwindcss
    npx tailwindcss init
    ```

4.  Install packages in server directory
    ```sh
    npm init -y
    npm install nodemon express mongoose dotenv body-parser jsonwebtoken multer cloudinary moment fs zod
    ```
5.  Install packages in common directory

    ```sh
    npm install
    npm install zod
    ```

6.  setup .env in client root
    process.env.REACT_APP_CLOUDINARY_CLOUD_NAME=derhxkzhd

7.  setup .env in server root
    SECRET=SECr3t

8.  Run frontend from client directory
    ```sh
    npm run dev
    ```
9.  Run backend from server directory
    ```sh
    nodemon index.js
    ```
