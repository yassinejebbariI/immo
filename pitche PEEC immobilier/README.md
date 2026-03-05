# PEEC Platform - Plateforme Immobilière Sécurisée

Application web complète pour la gestion immobilière au Maroc avec vérification des annonces, analyse IA, et traçabilité.

## 🚀 Fonctionnalités

- **Sécurité**: Vérification des documents et agences
- **Transparence**: Analyse des prix avec IA
- **Traçabilité**: Suivi complet des visites
- **Multi-rôles**: Client, Agence, Admin

## 📦 Installation

```bash
# Installer les dépendances
npm run install:all

# Configurer l'environnement
cp backend/.env.example backend/.env
# Modifier MONGODB_URI et JWT_SECRET dans backend/.env

# Démarrer MongoDB (requis)
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod

# Lancer l'application
npm run dev
```

L'application sera accessible sur:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🛠️ Technologies

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Auth**: JWT
- **API**: REST

## 📁 Structure

```
peec-platform/
├── frontend/       # Application React
├── backend/        # API Express
└── shared/         # Types partagés
```

## 👥 Rôles

- **Client**: Recherche et visite de biens
- **Agence**: Gestion des annonces
- **Admin**: Vérification des annonces
