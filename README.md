# PULSE AI  PULSE AI: Punjab Unified Life Safety & Emergency AI

![License](https://img.shields.io/badge/License-MIT-blue.svg)

> A web application for disaster management and emergency response, designed to provide real-time information, educational resources, and interactive tools to help users prepare for and respond to emergencies.

---

## ✨ Key Features

*   **🔎 Disaster Analysis:** Provides detailed analysis of potential disasters in a given location.
*   **🚨 Virtual Drills:** Interactive drills to prepare users for various emergency scenarios.
*   **👑 Emergency Contacts:** A repository of emergency contact information.
*   **🎮 Games:** Educational games to make learning about disaster preparedness more engaging.
*   **🏆 Leaderboard:** A leaderboard to encourage participation in games and drills.
*   **👥 User Profiles:** Personalized user profiles with the ability to update information.
*   **🖥️ Admin Dashboard:** A dashboard for administrators to manage users, content, and application data.

---

## 🚀 Tech Stack

### Frontend

*   [React](https://reactjs.org/)
*   [Material-UI](https://mui.com/)
*   [Axios](https://axios-http.com/)
*   [React Router](https://reactrouter.com/)

### Backend

*   [Flask](https://flask.palletsproject.com/)
*   [MongoDB](https://www.mongodb.com/)
*   [JWT](https://jwt.io/)
*   [Google Gemini API](https://ai.google.dev/)

---

## 🚀 Getting Started

### Prerequisites

*   Node.js (v14 or later)
*   npm
*   Python (v3.8 or later)
*   pip
*   MongoDB account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mannsuitxx/pulseai.git
    cd pulseai
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    cp .env.example .env
    ```

    Fill in the required environment variables in the `.env` file.

3.  **Frontend Setup:**

    ```bash
    cd ../frontend
    npm install
    cp .env.example .env
    ```

    Fill in the required environment variables in the `.env` file.

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    flask run
    ```

2.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm start
    ```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.