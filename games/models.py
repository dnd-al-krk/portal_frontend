from profile import Profile

from django.db import models
from django.utils.translation import ugettext_lazy as _

from .constants import (ADVENTURE_TYPE_EX, ADVENTURE_TYPE_EN, ADVENTURE_TYPE_EP, ADVENTURE_TYPE_HC, ADVENTURE_TYPE_IA,
                        ADVENTURE_TYPE_LE, ADVENTURE_TYPE_CCC, ADVENTURE_TYPE_OTHER, ADVENTURE_TYPE_AO)
from utils.models import UUIDModel


class Table(UUIDModel):
    name = models.CharField(_('Table name'), max_length=100)
    max_spots = models.PositiveIntegerField(_('Maximum spots'), default=1)

    class Meta:
        verbose_name = _('Table')
        verbose_name_plural = _('Tables')
        ordering = ['id']

    def __str__(self):
        return self.name


ADVENTURE_TYPES = (
    (ADVENTURE_TYPE_EN, _('EN')),
    (ADVENTURE_TYPE_EP, _('EP')),
    (ADVENTURE_TYPE_EX, _('EX')),
    (ADVENTURE_TYPE_HC, _('HC')),
    (ADVENTURE_TYPE_IA, _('IA')),
    (ADVENTURE_TYPE_LE, _('LE')),
    (ADVENTURE_TYPE_CCC, _('CCC')),
    (ADVENTURE_TYPE_AO, _('AO')),
    (ADVENTURE_TYPE_OTHER, _('Other')),
)


class Adventure(UUIDModel):
    season = models.PositiveIntegerField(_('Season'), blank=True, null=True)
    number = models.PositiveIntegerField(_('Number'), blank=True, null=True)
    title = models.CharField(_('Title'), max_length=255)
    type = models.IntegerField(_('Type'), choices=ADVENTURE_TYPES, default=ADVENTURE_TYPE_EX)

    class Meta:
        verbose_name = _('Adventure')
        verbose_name_plural = _('Adventures')
        ordering = ('season', 'number', 'title')

    def __str__(self):
        if self.type == ADVENTURE_TYPE_OTHER:
            return self.title

        return 'DD{type}{season}{number} - {title}'.format(
            type=self.get_type(),
            season=self.get_season(),
            number=self.get_number(),
            title=self.title
        )

    def get_season(self):
        return str(self.season) + '-' if self.season else ''

    def get_number(self):
        return str(self.number) if self.number else ''

    def get_type(self):
        return self.get_type_display() if self.type != ADVENTURE_TYPE_OTHER else ''


class GameSession(UUIDModel):
    date = models.DateField(_('Date'))
    table = models.ForeignKey(Table, related_name='game_sessions', on_delete=models.CASCADE)
    dm = models.ForeignKey('profiles.Profile', related_name='game_sessions', on_delete=models.SET_NULL, blank=True,
                           null=True)
    players = models.ManyToManyField('profiles.Profile', related_name='played_sessions', blank=True, through='games.GameSessionPlayerSignUp')
    adventure = models.ForeignKey(Adventure, related_name='game_sessions', on_delete=models.SET_NULL, blank=True,
                                  null=True)
    spots = models.PositiveIntegerField(_('Number of spots'), default=5)
    notes = models.CharField(_('Additional notes'), max_length=255, blank=True, null=True)
    time_start = models.TimeField(_('Starting time'), blank=True, null=True)
    time_end = models.TimeField(_('Ending time'), blank=True, null=True)

    class Meta:
        verbose_name = _('Game Session')
        verbose_name_plural = _('Game Sessions')
        ordering = ('-date', 'table',)

    def __str__(self):
        return '{date} / {table} / {adventure}'.format(
            date=self.date,
            table=self.table,
            adventure=str(self.adventure)
        )

    def can_sign_up(self, profile: Profile):
        # TODO: Add test to cover this logic
        return self.players.count() < self.spots and profile not in self.players.all()

    def can_sign_out(self, profile: Profile):
        # TODO: Add  test to cover this logic
        return profile in self.players.all()


class GameSessionPlayerSignUp(models.Model):
    game = models.ForeignKey(GameSession, on_delete=models.CASCADE)
    player = models.ForeignKey('profiles.Profile', on_delete=models.CASCADE)
    created = models.DateTimeField(_('Created'), auto_now_add=True)
    character = models.ForeignKey('profiles.PlayerCharacter', null=True, blank=True, on_delete=models.SET_NULL)
