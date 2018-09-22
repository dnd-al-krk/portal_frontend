import factory

from ..models import Adventure


class AdventureFactory(factory.Factory):
    class Meta:
        model = Adventure

    title = 'Super Adventure'

