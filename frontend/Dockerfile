FROM node

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --legacy-peer-deps 
RUN npm install react-scripts@3.2.0 -g --silent
ENV NODE_OPTIONS=--openssl-legacy-provider

# start app
ENTRYPOINT ["npm", "start"]


