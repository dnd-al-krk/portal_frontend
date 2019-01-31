FROM node:9.6.1

RUN mkdir /code
RUN mkdir /code/front
RUN mkdir /code/templates
RUN mkdir /code/static
WORKDIR /code/front

ENV PATH /code/front/node_modules/.bin:$PATH

COPY ./front/ /code/front/


RUN npm install --silent
