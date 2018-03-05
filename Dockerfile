FROM node
RUN mkdir /src
ADD . /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install
EXPOSE 3000
CMD node server.js
