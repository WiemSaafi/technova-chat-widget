# TechNova Chat Widget Backend - Dockerfile pour Coolify

# Image Node.js officielle
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers du backend
COPY backend/package*.json ./
COPY backend/ ./

# Copier les fichiers JavaScript de la racine (nécessaires pour le widget)
COPY widget-embed.js ./
COPY technova-config-production.js ./
COPY technova-chat-widget-production.js ./

# Installer les dépendances
RUN npm install --production

# Exposer le port
EXPOSE 3001

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["npm", "start"]