FROM node:12
WORKDIR '/usr/worker'
COPY package.json .
COPY package-lock.json .
RUN npm install --silent
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]