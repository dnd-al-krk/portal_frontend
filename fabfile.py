from contextlib import contextmanager

from fabric.colors import magenta
from fabric.context_managers import prefix, cd, lcd
from fabric.contrib.console import confirm
from fabric.operations import local, run

# add local configs
from fabric_config import *


@contextmanager
def virtualenv():
    with prefix('source ' + os.path.join(env.env_path, 'bin/activate')):
        yield


@contextmanager
def cd_project(root=None):
    root = root or env.project_root
    print(root)
    if env.local:
        with lcd(root):
            yield
    else:
        with cd(root):
            yield


def run_or_local(*args, **kwargs):
    if env.local:
        _run = local
    else:
        _run = run
    return _run(*args, **kwargs)


# == GIT OPERATIONS ==

@task
def fetch():
    with cd_project():
        run('git fetch')


@task
def pull():
    with cd_project():
        run('git pull')


@task
def remove_pyc():
    with cd_project():
        run('find . -name "*.pyc" -exec rm -rf "{}" \;')


@task
def manage(command, **kwargs):
    with cd_project():
        run_or_local(
            '{}/bin/python manage.py {} --settings={}'.format(
                env.env_path,
                command,
                env.DJANGO_SETTINGS_MODULE),
            **kwargs)


@task
def restart():
    """
    Restarts remote instance app
    """
    run(env.restart_command)


@task
def runserver():
    """
    Runs local app
    """
    manage('runserver 0.0.0.0:8000')


@task
def test():
    """
    Runs local tests
    """
    manage('test --keepdb')


@task
def bootstrap(keep_db=False):
    """
    Sets up local workspace
    """
    if not env.local:
        print(magenta('THIS COMMAND SHOULD BE RUN ONLY ON LOCAL INSTANCE'))
    if not keep_db:
        local('rm {}'.format('db.sqlite3'))
    manage('migrate')
    manage('createsuperuser')


@task
def deploy():
    if env.environment == 'prod':
        if not confirm('Deploying to prod. Are you sure?', default=False):
            return

    fetch()
    pull()
    with virtualenv():
        run('pip install -r requirements/{}.txt'.format(env.environment))

    manage('migrate')
    manage('collectstatic')
    remove_pyc()
    restart()
