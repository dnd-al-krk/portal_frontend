# portal
portAL - Adventure's League community management service

# Requirements

This project is developed for Python 3.5.3 (or newer). 

# Installation

## Backend

The steps are:

1. Clone this repo
1. cd to repo (with `manage.py` file)
1. Create virtualenv with virtualenvwrapper: `mkvirtualenv portal`
1. Install requirements `pip install -r requirements.txt`
1. Create file `fabric_config.py` with contents (adjust if something is different in your config):

```
import os

from fabric.utils import _AttributeDict

class DevelConfig(_AttributeDict):
    def __init__(self):
        self.local = True
        self.environment = 'devel'
        self.domain = 'localhost'
        self.env_path = '~/.virtualenvs/portal'

        self.project_root = os.path.dirname(os.path.abspath(__file__))
        self.DJANGO_SETTINGS_MODULE = 'settings.{environment}'.format(**self)
```

1. Bootstrap app with `fab devel bootstrap`
1. Run server with `fab devel runserver`
1. Open in the browser `localhost:8000`


## Frontend

1. Clone this repo if not cloned yet
1. Enter repo dir and inside the `front` dir 
1. Run `npm install`
1. Run `npm run start`
1. The browser will start page automatically (`localhost:3000`)
