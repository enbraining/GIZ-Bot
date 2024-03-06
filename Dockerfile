FROM node:18

COPY package*.json ./

RUN npm install  
CMD ["npm", "run", "build"]

CMD ["ls"]

COPY . .

EXPOSE 3004

CMD ["npm", "run", "start"]
