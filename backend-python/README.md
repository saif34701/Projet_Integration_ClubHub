# ISET ClubHub Backend

API FastAPI pour la plateforme ISET ClubHub.

## Stack

- FastAPI
- MongoDB avec Motor
- JWT avec `python-jose`
- Passlib/bcrypt pour les mots de passe
- Gemini API pour la generation de captions

## Configuration

Copiez `.env.example` vers `.env`, puis renseignez les valeurs necessaires:

```env
APP_NAME="ISET ClubHub API"
ENV=development
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=clubhub
JWT_SECRET=change_me_to_a_secure_random_string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
```

## Installation

```bash
cd backend-python
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Seed demo

```bash
python -m app.seed.seed_mongo
```

Comptes de demonstration:

- Admin: `admin@clubhub.tn` / `Admin123!`
- Responsable: `manager@clubhub.tn` / `Manager123!`
- Etudiant: `student@clubhub.tn` / `Student123!`

## Lancement

```bash
uvicorn app.main:app --reload
```

API: `http://localhost:8000`

Documentation Swagger: `http://localhost:8000/docs`

## Authentification

Le backend expose seulement le flux simple et stable pour la soutenance:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Le seul token utilise est le JWT de session.
