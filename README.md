# E-cloud

E-cloud is a user-friendly file storage system designed to mimic the functionality of Google Drive. It allows users to log in, and manage their files with ease. Users can upload, open, modify, and delete files, and optionally attach captions to their uploads. File storage is managed securely through AWS S3, offering a seamless experience for handling personal files.

---

## Key Features

- **Account Management:** Sign up and authenticate users with AWS Cognito and Amplify.
- **File Operations:** Perform full CRUD (Create, Read, Update, Delete) operations on files.
- **File Storage:** Secure storage using AWS S3.
- **File Captioning:** Option to add captions to files for easy identification.

---

## Technology Overview

### Core Technologies:
- **JavaScript**: Used across the stack for frontend and backend.
- **React.js**: Frontend framework for building interactive UI.
- **Node.js & Express.js**: Backend server for handling API requests.

### Authentication:
- **AWS Cognito**: User sign-up, login, and authentication services.
- **AWS Amplify**: Streamlines AWS services for frontend integration.

### Storage:
- **Amazon S3**: Secure cloud storage for user files.
- **AWS RDS (MySQL)**: Relational database for user and file metadata.

### Other Libraries & Tools:
- **React-Router-Dom**: Frontend routing and navigation.
- **CORS**: Middleware for handling cross-origin requests.
- **Body-Parser**: Middleware for processing incoming API request bodies.


## Project Overview

### Sign Up Process
The sign-up process is simple and efficient. Users enter their username, email, password, and phone number. Once registered, they receive an authentication code via email to verify their account.

### Sign In & Authentication
After verifying their email, users can log in securely via AWS Cognito, ensuring account safety and fast authentication.

### File Management Dashboard
The dashboard allows users to view, download, edit, or delete their uploaded files, with options to update captions or remove files as needed.

### Uploading Files
Users can upload files either by drag-and-drop or by selecting files manually from their device. Each file can also have an optional caption added.


## How to Run the Project

### Requirements:  
Requirements
To run this project, you will need:
- Node.js & npm: For running the backend and managing dependencies.
- AWS Account: Access to AWS services like Cognito, S3, and RDS.
- MySQL Database: Set up using AWS RDS or locally for storing metadata.
- Environment Variables: AWS credentials and MySQL configuration stored in a .env file.

