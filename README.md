<p align="center">
  <img src="client/public/pulse-icon.svg" alt="Pulse Icon" width="120" />
</p>

<h1 align="center">💬 Pulse Chat</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-blue?logo=java&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.4.4-brightgreen?logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/Maven-4.0-orange?logo=apachemaven&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.7.2-blue?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-6.3.0-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/MUI-7-007FFF?logo=mui&logoColor=white" />
  <img src="https://img.shields.io/badge/H2_Database-embedded-lightgrey?logo=databricks&logoColor=white" />
</p>

---

**Pulse Chat** is a modern, simple, and real-time chat application built as a side project to showcase full-stack development skills. It features a clean Material UI design, secure authentication, and real-time messaging.

---

## ✨ Features

✅ **Real-time Messaging** — Messages delivered instantly via WebSocket.  
✅ **User Last Seen** — Displays last active time for each user.  
✅ **JWT Authentication** — Secure token-based user login.  
✅ **Password Encryption** — User passwords securely hashed.  
✅ **Modern UI** — Responsive design with Material UI + TypeScript.  
✅ **H2 In-Memory DB** — Lightweight and fast for testing/demo.

---

## 🚀 Getting Started

### Backend

> Default url is localhost:8080

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd client
yarn install
yarn dev
```

> Default url is localhost:3000

---

## Screenshots

### Registration Page

![Registration Page](screenshots/register_page.png "Registration Page")

### Login Page

![Login Page](screenshots/login_page.png "Login Page")

### Welcome Page

![Welcome Page](screenshots/welcome_page.png "Welcome Page")

### Messaging

![Messaging Page](screenshots/messaging_page.png "Messaging")

### People List

![People Page](screenshots/people_page.png "People List")

### Light Theme

![Light Theme](screenshots/light_theme.png "Light Theme")

## 🛠️ Testing

Run All backend unit tests:

```bash
cd server
mvn test
```

---

## 🧪 Unit Test Coverage

The project includes unit tests to validate critical functionalities like user registration, login, and JWT validation.

---

## 📧 Contact

Feel free to reach out for suggestions or contributions from github issues or PR
