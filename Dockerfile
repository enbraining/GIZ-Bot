FROM node:18

COPY package*.json ./

RUN npm install  
CMD ["npm", "run", "build"]

CMD ["ls"]

COPY . .

EXPOSE 3005

CMD ["npm", "run", "start"]
