FROM node:10.15.1

RUN mkdir /code
RUN mkdir /code/static
COPY . /code/

RUN useradd --create-home --home-dir /home/front front

RUN chown -R front:front /code

USER front

WORKDIR /code/front

ENV PATH /code/front/node_modules/.bin:$PATH

RUN npm install --silent
