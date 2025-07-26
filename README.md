# 🛒 Full Stack AI Chat Assistant for E-commerce

A full-stack customer support chatbot for an e-commerce clothing site, demonstrating modern web development and AI integration. Users can interact with an AI assistant to get answers to product and order-related queries.

---

## 🚀 Key Features & Development Skills Demonstrated

- **Interactive Chat UI**  
  Built with **ReactJS** and styled using **Tailwind CSS**, showcasing responsive design and component-based architecture.

- **AI Integration**  
  Leverages **Google Gemini API (gemini-2.0-flash)** via a **Node.js (Express.js)** backend for intelligent conversational responses.

- **Contextual AI Prompting**  
  The AI is "trained" using mock e-commerce data (products, orders), demonstrating **domain-specific LLM prompting**.

- **Backend Development**  
  Robust Node.js API using **dotenv** for env variables and **cors** for cross-origin requests.

- **Containerization & Deployment**  
  Uses **Docker** and **Docker Compose** for consistent local and production deployment.

---

## 🧰 Technologies Used

### Frontend
- ReactJS  
- Tailwind CSS  
- Vite  

### Backend
- Node.js (Express.js)  
- Google Generative AI SDK  
- dotenv, cors  

### AI Model
- Google Gemini API (gemini-2.0-flash)

### Containerization
- Docker  
- Docker Compose  

---

## 📁 Project Structure

```/chat-bot
├── /frontend # ReactJS application
│ ├── src/App.js # Main chat component
│ ├── package.json
│ ├── tailwind.config.js
│ └── Dockerfile
├── /backend # Node.js backend
│ ├── server.js # Backend logic & AI integration
│ ├── package.json
│ ├── .env # API Key
│ └── Dockerfile
└── docker-compose.yml # Docker Compose configuration
```


---

## ⚙️ Setup and Running Instructions

### 🔧 Prerequisites
- Node.js (LTS) & npm or Yarn  
- Docker Desktop (optional, for containerization)

---

### 1. Backend Setup

```bash
cd full-stack-chat-app/backend
npm install   # or yarn install
```
Create .env file:
```bash
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Run the server:
```bash
node server.js
```

---

### 2. Frontend Setup

```bash
cd full-stack-chat-app/frontend
npm install   # or yarn install
```

Run frontend:
```bash
npm run dev
```

---

### 3. Dockerization (Optional)

From project root:
```bash
docker-compose up --build
```
