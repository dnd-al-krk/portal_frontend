FROM node:10.15.1

RUN mkdir /code
COPY . /code/

RUN useradd --create-home --home-dir /home/front front

RUN chown -R front:front /code

USER front

WORKDIR /code

ENV PATH /code/node_modules/.bin:$PATH

RUN npm install --silent
