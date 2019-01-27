FROM node:9.6.1

RUN mkdir /code
RUN mkdir /code/front
RUN mkdir /code/templates
WORKDIR /code/front

ENV PATH /code/front/node_modules/.bin:$PATH

COPY ./front/ /code/front/
COPY ./templates/ /code/templates/
COPY ./static/ /code/static/

RUN npm install --silent
