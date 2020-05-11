FROM node:12
COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install --silent
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]