# ISET ClubHub

Plateforme de gestion des clubs universitaires de l'ISET.

## Structure

```text
backend-python/              API FastAPI + MongoDB
clubhub/campus-club-hub-main Frontend React + Vite
docs/DIAGRAMS.md             Diagrammes UML Mermaid
```

## Backend

```bash
cd backend-python
venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed.seed_mongo
uvicorn app.main:app --reload
```

API: `http://localhost:8000`

Swagger: `http://localhost:8000/docs`

## Frontend

```bash
cd clubhub/campus-club-hub-main
npm install
npm run dev
```

Application: `http://localhost:5173`

## Comptes demo

- Admin: `admin@clubhub.tn` / `Admin123!`
- Responsable: `manager@clubhub.tn` / `Manager123!`
- Etudiant: `student@clubhub.tn` / `Student123!`

## Fonctionnalites principales

- Authentification par email/mot de passe avec JWT
- Gestion des clubs et utilisateurs par l'admin
- Demandes d'adhesion aux clubs
- Gestion des membres par le responsable
- Annonces, evenements et reunions
- Notifications internes
- Generation de captions avec Gemini

