from django.contrib.auth.models import User
from django.db import models
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import ugettext_lazy as _

from utils.email import send_email
from utils.models import UUIDModel
from .constants import ROLE_DM, ROLE_PLAYER
from .utils import account_activation_token


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

    def save(self, *args, **kwargs):
        created = False if self.pk else True
        super().save(*args, **kwargs)
        if created:
            self.send_verification_email()

    def send_verification_email(self):
        send_email(
            [self.user.email],
            'Activate your portAL account.',
            'emails/account_activate_email.html',
            {
                'user': self.user,
                'profile': self,
                'uid': urlsafe_base64_encode(force_bytes(self.user.pk)).decode(),
                'token': account_activation_token.make_token(self.user),
            }
        )


class CharacterClass(UUIDModel):
    name = models.CharField(_('Class Name'), max_length=16)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class CharacterRace(UUIDModel):
    name = models.CharField(_('Race Name'), max_length=16)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class CharacterFaction(UUIDModel):
    name = models.CharField(_('Faction Name'), max_length=16)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class PlayerCharacter(UUIDModel):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='characters')
    name = models.CharField(_('Character name'), max_length=255)
    pc_class = models.ForeignKey(CharacterClass, on_delete=models.CASCADE)
    race = models.ForeignKey(CharacterRace, on_delete=models.CASCADE)
    faction = models.ForeignKey(CharacterFaction, on_delete=models.CASCADE, blank=True, null=True)
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
