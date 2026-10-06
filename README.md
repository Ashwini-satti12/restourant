Project: Restaurant site (Django backend + React frontend)

Quick start

1. Backend (Python/Django)

- Create a virtual environment and install dependencies:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
```

- Apply migrations and create sample data:

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver
```

- You can add locations and menu items via the admin or the API at `http://127.0.0.1:8000/api/`.

2. Frontend (React)

- Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm start
```

- The React app expects the backend at `http://localhost:8000`.

Notes
- This is a starter scaffold. Replace `SECRET_KEY` in `backend/restaurant_site/settings.py` before deploying.
- To prepopulate with three locations (Bangalore, Belgaum, Athani), use the Django admin or create a data migration.

Add your own images
- Place the image you attached (the thali photo) at `frontend/public/images/thali.jpg` so the homepage hero and first menu item use it.
- You can replace any other images in `frontend/public/images/` with your Figma exports for a pixel-perfect match.
