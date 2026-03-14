FROM node:10.15.1

RUN mkdir /code
COPY . /code/

#RUN useradd --create-home --home-dir /home/node node

RUN chown -R node:node /code

USER node

WORKDIR /code

ENV PATH /code/node_modules/.bin:$PATH

RUN npm install --silent
