# portal
portAL - Adventure's League community management service

# Requirements

In order to run and develop this project you need [docker](https://docs.docker.com/) and [docker compose](https://docs.docker.com/compose/) installed in your system. Nothing else is required.

# Development

To start developing the project:

1. Clone the repository to your directory
1. Run `$ cp docker-compose.dev.yml docker-compose.override.yml` -- this will create your own docker compose file for development. You can adjust it to your needs.
1. Run `$ docker-compose build` - this will build necessary docker images.
1. Run `$ docker-compose run backend bootstrap` - this will create necessary files, migrate db and import fixtures

To start development run `docker-compose up`. You can now open front-end in the browser under `localhost:3000` and backend under `localhost:8000`.

## Pre-generated users

Fixtures for the project provide basic users for each type: admin, DM and player.

Admin credentials are:
- username: admin@domain.com
- password: portal123

There are also added numerous of players/DM accounts created:
- dmX@domain.com (e.g. dm1@domain.com)
- userX@doman.com (e.g. user1@doman.com)

Their passwords are the same as login.

## Pre-genrated data

The fixtures also provide necessary data to start development process. You have past and future game sessions, example adventures and game session DM bookings or signups from players. All you need to get started.

## Development guidelines

- We are deeloping for python 3.6+
- We try to stick with fairly recent django version
- We stick to PEP-8 except lines length which can be up to 120 chars (PyCharm standard)

We are using [black](https://github.com/ambv/black) formatter to standarize code in the project. To use it fully:
1. Create local virtualenv (see manual instalation below) and install black with `pip install black`
1. Install [pre-commit](https://pre-commit.com/)
1. Run `$ pre-commit install` - this will install pre-commit hook to your git repository that will check code with black on commit

# Manual Installation without Docker

## Backend

The steps are:

1. Clone this repo
1. cd to repo (with `manage.py` file)
1. Create virtualenv with virtualenvwrapper: `mkvirtualenv portal`
1. Install requirements `pip install -r requirements/devel.txt`
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

1. Bootstrap app with `fab devel bootstrap` -- this command is run once only on the first setup. It will let you create superuser for instance, which you will use two steps later.
1. Run server with `fab devel runserver`
1. Open in the browser `http://localhost:8000/admin/` to access admin interface and provide any starting data.


*Note*: If you already have virtualenv created previously simply enter it before starting server: `workon portal`

### Testing

You can run pytest tests with:

`fab devel test` or simply `pytest` as well.

## Frontend

1. Clone this repo if not cloned yet
1. Enter repo dir and inside the `front` dir
1. Run `npm install`
1. Run `npm run start`
1. The browser will start page automatically (`localhost:3000`) -- this is the interface for the user

Build with `npm run build` - it will move static and template files to proper directories and thus you will be able to access user interface also under `http://localhost:8000/`

## License disclaimer

**portAL** is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.

**Note:** Code itself is available under the open source licence, but part of the repository materials (especially images) are used under the Fan Content Policy and cannot be redistributed or used commercially.
