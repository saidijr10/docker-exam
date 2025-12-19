
# Étape 1 : build


# On utilise l'image officielle Node.js légère pour construire l'application
FROM node:25-alpine AS build

# Définit le répertoire de travail dans le conteneur (comme un cd )
WORKDIR /app

# Copie le fichier package.json pour installer les dépendances
COPY backend/package.json .

# Installe les dépendances Node.js dans /app/node_modules
RUN npm install

# Copie le reste du code source de l'application
COPY backend .


# Étape 2 : runtime 


# On utilise à nouveau l'image Node.js légère pour le conteneur final
FROM node:25-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie uniquement les fichiers nécessaires depuis l'étape de build
# Cela permet de réduire la taille de l'image finale en ne gardant que le nécessaire
COPY --from=build /app /app

# Expose le port 3000 pour l'application
EXPOSE 3000

# Commande pour lancer l'application
CMD ["npm", "start"]
