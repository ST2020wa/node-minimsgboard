# Mini Message Board Project

<img width="1146" alt="Screen Shot 2025-01-07 at 2 34 55 PM" src="https://github.com/user-attachments/assets/626aabd9-d248-4ed0-9a44-c24b630cd3c5" />


Welcome to the Message Board project! There's a quick look ⬆️. This project is a simple web application that allows users to view and post messages. It features a front-end built with Angular and a back-end built with Node.js.

### Version 2 (v2) Release Highlights

In the second release, we've introduced **sign-up and log-in functionality** to enhance user interaction. Now, only logged-in users can post messages on the board. Visitors can view messages anonymously (without sender names displayed), sign up using an **invitation code**, and log in to reveal message senders and contribute their own posts. All user information and messages are securely stored in a **PostgreSQL database**, ensuring data persistence and reliability.

## Project Structure

```
Message-Board/
├── miniboard-ng/        # Front-end code (Angular)
│   ├── src/
│   ├── package.json
│   └── angular.json
│
└── minboard-node/       # Back-end code (Node.js)
    ├── server.js
    ├── package.json
    └── routes/
```
The project is organized into two main folders: miniboard-ng (for the front-end) and miniboard-node (for the back-end). 

miniboard-ng/: This folder contains the Angular front-end application. It includes the user interface for submitting and viewing messages.
minboard-node/: This folder contains the Node.js back-end API that handles requests for creating and retrieving messages.



## Prerequisites

Before you start, make sure you have the following installed on your system:
- Node.js (version 14 or higher)
- Angular CLI (for front-end development)
- npm (for installing dependencies)

### Setup Instructions
#### 1. Clone the repository

Clone the repository to your local machine:
```
git clone <repository-url>
cd Message-Board
```
#### 2. Install Front-End Dependencies

Navigate to the miniboard-ng folder and install the Angular dependencies:
```
cd miniboard-ng
npm install
```
#### 3. Install Back-End Dependencies

Navigate to the minboard-node folder and install the Node.js dependencies:
```
cd ../minboard-node
npm install
```
#### 4. Run the Back-End Server

To start the Node.js server:
```
cd minboard-node
npm start
```
This will run the back-end API on http://localhost:3000.

#### 5. Run the Front-End Application

To start the Angular front-end:
```
cd ../miniboard-ng
ng serve
```
This will run the Angular app on http://localhost:4200.

## Features
- Post Messages: Users can submit messages with a username and content.
- View Messages: Users can view all previously submitted messages.
- Simple UI: A minimal interface that displays the messages in a clean format.

## Potential Improvements

- Message Length Limiting: Add a notice when the page silently trims a too-long message, so the user is aware of the truncation.
- Error Handling for Sending Messages: Improve the user experience by showing error messages (e.g., message length exceeds limit) in a more elegant and user-friendly way.

### Known Issues

- The current error handling is basic. Errors are shown as simple alerts or text, and more user-friendly error handling (e.g., modal dialogs) could improve the experience.
- Message length trimming is silently handled, and users are not notified if their message exceeds the length limit.

## Contributions

Feel free to fork this project and submit pull requests. If you'd like to contribute, please follow these steps:
- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Commit your changes (git commit -am 'Add feature').
- Push to the branch (git push origin feature-branch).
- Create a pull request.

## License

This project is open source.

### Feel free to modify the instructions as needed for your specific setup!
