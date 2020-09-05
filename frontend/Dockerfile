FROM node:14

WORKDIR /app/frontend

COPY package.json /app/frontend

# RUN yarn add react-scripts

RUN yarn install

# RUN npm install node-sass

COPY . /app/frontend

EXPOSE 3000

CMD ["yarn", "start"]
