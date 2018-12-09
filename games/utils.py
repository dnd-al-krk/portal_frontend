from django.contrib.auth.models import User
from django.utils import timezone

from games.models import GameSessionQuerySet
from utils.email import send_email


def send_report(queryset: GameSessionQuerySet):
    for_update = queryset.reported()
    timestamp = timezone.now().strftime('%Y-%m-%d')
    receivers = list(User.objects.filter(is_superuser=True).values_list('email', flat=True))

    games = []

    for session in for_update:
        game = {
            'date': session.date,
            'players': list(session.gamesessionplayersignup_set.filter(reported=True).values_list('player__dci', flat=True)),
            'dm': session.dm.dci,
            'extra_players': session.extra_players
        }
        games.append(game)

    send_email(
        f'Report for the games {timestamp}',
        'emails/games_report.html',
        {
            'games': games,
        },
        to=receivers,
    )
