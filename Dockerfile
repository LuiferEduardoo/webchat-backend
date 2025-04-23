# Usa una imagen oficial de Node.js como base
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto que usa tu API
EXPOSE 3000

# Comando para correr la API
CMD ["npm", "run", "start"]