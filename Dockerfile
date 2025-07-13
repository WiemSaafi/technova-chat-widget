# TechNova Chat Widget Backend - Dockerfile pour Coolify

# Image Node.js officielle
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers du backend
COPY backend/package*.json ./
COPY backend/ ./

# Installer les dépendances
RUN npm install --production

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["npm", "start"]
