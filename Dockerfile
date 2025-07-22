# TechNova Chat Widget Backend - Dockerfile pour Coolify

# Image Node.js officielle
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json du backend
COPY backend/package*.json ./

# Installer les dépendances d'abord
RUN npm install --production

# Copier les fichiers du backend (sans écraser)
COPY backend/server.js ./
COPY backend/.env.example ./

# Copier les fichiers JavaScript de la racine (nécessaires pour le widget)
COPY widget-embed.js ./

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["npm", "start"]
