import factory

from ..models import Adventure, GameSession


class AdventureFactory(factory.Factory):
    class Meta:
        model = Adventure

    title = 'Super Adventure'


class GameSessionFactory(factory.Factory):
    class Meta:
        model = GameSession
