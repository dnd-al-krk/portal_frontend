# portal
portAL - Adventure's League community management service

# Requirements

This project is developed for Python 3.5.3 (or newer). 

# Installation

## Backend

The steps are:

1. Clone this repo
1. cd to repo and then into the `portal` dir (with `manage.py` file)
1. Create virtualenv with virtualenvwrapper: `mkvirtualenv portal`
1. Install requirements `pip install -r requirements.txt`
1. Set your env variable with settings `export DJANGO_SETTINGS_MODULE=settings.devel`
1. Run migrations with `python manage.py migrate`
1. Create superuser with `python manage.py createsuperuser`
1. Run server with `python manage.py runserver`
1. Open in the browser `localhost:8000`


## Frontend

1. Clone this repo if not cloned yet
1. Enter repo dir and inside the `front` dir 
1. Run `npm install`
1. Run `npm run start`
1. The browser will start page automatically (`localhost:3000`)
