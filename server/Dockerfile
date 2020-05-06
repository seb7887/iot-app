FROM node:12
WORKDIR '/usr/app'
COPY package.json .
COPY package-lock.json .
RUN npm install --silent
COPY . .
RUN npm run build
EXPOSE 7777
CMD ["npm", "run", "start"]