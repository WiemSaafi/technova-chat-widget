# TechNova Chat Widget Backend - Dockerfile CORRIGÉ pour Coolify
# Image Node.js officielle
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers package du backend
COPY backend/package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier TOUS les fichiers du backend (serveur + widget files)
COPY backend/ ./

# ✅ CORRECTION PRINCIPALE: Les fichiers JS sont déjà dans backend/
# Pas besoin de COPY supplémentaires - ils sont inclus dans COPY backend/ ./

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["npm", "start"]
