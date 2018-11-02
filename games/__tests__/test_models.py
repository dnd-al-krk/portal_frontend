from django.utils import timezone

from ..constants import ADVENTURE_TYPE_OTHER
from .factories import AdventureFactory, GameSessionFactory

from pytest_factoryboy import register

register(AdventureFactory)
register(GameSessionFactory)


def test_factory_fixture(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER)

    assert adventure.type == ADVENTURE_TYPE_OTHER


def test_other_adventure_display_only_name(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER)

    assert str(adventure) == 'Super Adventure'


def test_future_game_session_not_ended(game_session_factory):
    # given
    game = game_session_factory(date=timezone.now().date() + timezone.timedelta(days=2))

    # then
    assert not game.ended


def test_past_game_session_ended(game_session_factory):
    # given
    game = game_session_factory(date=timezone.now().date() - timezone.timedelta(days=2))

    # then
    assert game.ended


def test_today_after_time_end_game_session_is_ended(game_session_factory):
    # given
    game = game_session_factory(date=timezone.now().date(),
                                time_end=(timezone.now() - timezone.timedelta(hours=2)).time())

    # then
    assert game.ended
