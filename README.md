# User Profile Card Generator

A responsive React + Flask app that collects a user's name, bio, and profile image URL, posts the data to a Flask API, and renders a modern profile card from the returned JSON.

## Structure

- `backend/` Flask API with `POST /profile`
- `frontend/` React app built with Vite

## Run locally

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/profile` requests to `http://127.0.0.1:5000`.
