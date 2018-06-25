from django.db import models
from django.contrib.auth.models import User

from django.utils.translation import ugettext_lazy as _

from .constants import ROLE_DM, ROLE_PLAYER


class Profile(models.Model):

    USER_TYPE = (
        (ROLE_DM, 'Dungeon Master'),
        (ROLE_PLAYER, 'Player')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dci = models.IntegerField(_('DCI'), blank=True, null=True)
    role = models.CharField(_('Role'), max_length=20, default=ROLE_PLAYER)
