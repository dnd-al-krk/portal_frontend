import factory
from pytest_factoryboy import register

from ..constants import ADVENTURE_TYPE_OTHER
from ..models import Adventure

@register
class AdventureFactory(factory.Factory):
    class Meta:
        model = Adventure

    title = 'Super Adventure'


def test_factory_fixture(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER)

    assert adventure.type == ADVENTURE_TYPE_OTHER


def test_other_adventure_display_only_name(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER)

    assert str(adventure) == 'Super Adventure'
