from profile import Profile

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from utils.email import send_email
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
        return str(self.season) + '-' if self.season is not None else ''

    def get_number(self):
        return str(self.number) if self.number is not None else ''

    def get_type(self):
        return self.get_type_display() if self.type != ADVENTURE_TYPE_OTHER else ''


class GameSessionQuerySet(models.QuerySet):
    def active(self):
        return self.filter(active=True)

    def future(self):
        return self.filter(date__gte=timezone.now())

    def past(self):
        return self.filter(date__lt=timezone.now())


class GameSessionActiveGamesManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super(GameSessionActiveGamesManager, self).get_queryset(*args, **kwargs).active()

    def future(self):
        return self.get_queryset().future()

    def past(self):
        return self.get_queryset().past()


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
    active = models.BooleanField(_('Active'), default=False)
    reported = models.BooleanField(_('Reported'), default=False)
    extra_players = models.CharField(_('Additional players'), max_length=255, blank=True, null=True)

    objects = models.Manager.from_queryset(GameSessionQuerySet)()
    games = GameSessionActiveGamesManager.from_queryset(GameSessionQuerySet)()


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
        return self.dm is not None and not self.ended and self.dm.id != profile.id and \
               self.players.count() < self.spots and profile not in self.players.all()

    @property
    def ended(self):
        t = timezone.now()
        return t.date() > self.date or (self.time_end is not None and t.date() == self.date and t.time() > self.time_end)

    def has_player(self, profile: Profile):
        return profile in self.players.all()

    def can_sign_out(self, profile: Profile):
        return self.has_player(profile) and not self.ended

    def checkMinimumPlayers(self):
        """
        This is run after a player signs out of the game session. If there are not enough players
        for the game session, the message is sent to other participants.
        """
        if self.players.count() < 3:
            send_email(
                'Not enough players in the game session',
                'emails/game_not_enough_players.html',
                {'game': self},
                bcc=[player.user.email for player in self.players.all()] + [self.dm.user.email]
            )

    def get_absolute_url(self):
        return settings.ROOT_URL + '/games/game/' + str(self.id)

    def cancel(self):
        self.dm = None
        self.save()

        send_email(
            'Game session cancelled',
            'emails/game_cancelled.html',
            {'game': self},
            bcc=[player.user.email for player in self.players.all()]
        )

    def booked_again(self):
        send_email(
            'Game session has a new DM',
            'emails/game_rebooked.html',
            {'game': self},
            bcc=[player.user.email for player in self.players.all()]
        )


class GameSessionPlayerSignUp(models.Model):
    game = models.ForeignKey(GameSession, on_delete=models.CASCADE)
    player = models.ForeignKey('profiles.Profile', on_delete=models.CASCADE)
    created = models.DateTimeField(_('Created'), auto_now_add=True)
    character = models.ForeignKey('profiles.PlayerCharacter', null=True, blank=True, on_delete=models.SET_NULL)
