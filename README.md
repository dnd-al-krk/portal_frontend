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

    ```python
    import os
    
    from fabric.decorators import task
    from fabric.utils import _AttributeDict


    class DevelConfig(_AttributeDict):
        def __init__(self):
            self.local = True
            self.environment = 'devel'
            self.domain = 'localhost'
            self.env_path = '~/.virtualenvs/portal'

            self.project_root = os.path.dirname(os.path.abspath(__file__))
            self.DJANGO_SETTINGS_MODULE = 'settings.{environment}'.format(**self)
    
            
    @task
    def devel():
        env.update(DevelConfig())

    ```

1. Bootstrap app with `fab devel bootstrap`
1. Run server with `fab devel runserver`
1. Open in the browser `localhost:8000`

### Testing

You can run pytest tests with:

`fab devel test` or simply `pytest` as well.

## Frontend

1. Clone this repo if not cloned yet
1. Enter repo dir and inside the `front` dir 
1. Run `npm install`
1. Run `npm run start`
1. The browser will start page automatically (`localhost:3000`)

Build with `npm run build` - it will move static and template files to proper directories.

## License disclaimer

**portAL** is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC. 

**Note:** Code itself is available under the open source licence, but part of the repository materials (especially images) are used under the Fan Content Policy and cannot be redistributed or used commercially.
