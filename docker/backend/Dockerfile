FROM python:3.7

RUN useradd --create-home --home-dir /home/back back
RUN apt-get update && apt-get install -y postgresql-client

RUN mkdir /code
COPY . /code/
RUN chown -R back:back /code

COPY docker/backend/docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh && chown back:back /docker-entrypoint.sh


USER back

ENV PATH /home/back/.local/bin:$PATH
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

ENV DJANGO_SETTINGS_MODULE=settings.docker
ENV PORTAL_PROD_DB_NAME=postgres
ENV PORTAL_PROD_DB_USER=postgres
ENV PORTAL_PROD_DB_HOST=db

WORKDIR /code
RUN pip install --user -r requirements/docker.txt

#RUN echo '*:*:*:postgres:postgres' > ~/.pgpass
#RUN chmod 600 ~/.pgpass

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["prod_web"]
