#node.js image
FROM node:20-slim

WORKDIR /app

#all dependencies
COPY package*.json ./
RUN npm install

# copy the React code
COPY . .

# rxpose the Vite port
EXPOSE 5173

# run the Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]