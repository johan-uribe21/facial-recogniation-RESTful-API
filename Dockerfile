FROM node:11.14
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 3000
CMD npm start