FROM node:12
WORKDIR '/usr/broker'
COPY package.json .
COPY package-lock.json .
RUN npm install --silent
COPY . .
RUN npm run build
EXPOSE 1883
EXPOSE 8883
EXPOSE 8881
EXPOSE 443
CMD ["npm", "run", "start"]