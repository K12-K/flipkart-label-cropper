# Dockerfile
FROM node:18

# Install poppler
RUN apt-get update && apt-get install -y poppler-utils

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "src/app.js"]