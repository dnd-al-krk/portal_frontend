import uuid

from django.db import models
from django.contrib.auth.models import User

from django.utils.translation import ugettext_lazy as _

from utils.models import UUIDModel
from .constants import ROLE_DM, ROLE_PLAYER


class Profile(models.Model):

    USER_TYPE = (
        (ROLE_DM, 'Dungeon Master'),
        (ROLE_PLAYER, 'Player')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    nickname = models.CharField(_('Nickname'), max_length=255, blank=True, null=True)
    dci = models.IntegerField(_('DCI'), blank=True, null=True)
    role = models.CharField(_('Role'), max_length=20, default=ROLE_PLAYER, choices=USER_TYPE)

    def __str__(self):
        return '{} {}'.format(self.user.first_name, self.user.last_name)

    def is_dm(self):
        return self.role == ROLE_DM


class CharacterClass(UUIDModel):
    name = models.CharField(_('Class Name'), max_length=16)

    def __str__(self):
        return self.name


class CharacterRace(UUIDModel):
    name = models.CharField(_('Race Name'), max_length=16)

    def __str__(self):
        return self.name


class CharacterFaction(UUIDModel):
    name = models.CharField(_('Faction Name'), max_length=16)

    def __str__(self):
        return self.name


class PlayerCharacter(UUIDModel):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='characters')
    name = models.CharField(_('Character name'), max_length=255)
    pc_class = models.ForeignKey(CharacterClass, on_delete=models.CASCADE)
    race = models.ForeignKey(CharacterRace, on_delete=models.CASCADE)
    faction = models.ForeignKey(CharacterFaction, on_delete=models.CASCADE)
    level = models.PositiveIntegerField(_('Level'), default=1)
    created = models.DateTimeField(_('Created'), auto_now_add=True)
    modified = models.DateTimeField(_('Modified'), auto_now=True)

    def __str__(self):
        return self.name


class DMNote(UUIDModel):
    dm = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='dm_notes_given')
    player = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='dm_notes')
    note = models.TextField(_('Note on player'))
    created = models.DateTimeField(_('Created'), auto_now_add=True)
    modified = models.DateTimeField(_('Modified'), auto_now=True)

    def __str__(self):
        return 'Note by {} for {}'.format(self.dm, self.player)
