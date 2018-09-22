from ..constants import ADVENTURE_TYPE_OTHER
from .factories import AdventureFactory

from pytest_factoryboy import register

register(AdventureFactory)


def test_factory_fixture(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER)

    assert adventure.type == ADVENTURE_TYPE_OTHER


def test_other_adventure_display_only_name(adventure_factory):
    adventure = adventure_factory(type=ADVENTURE_TYPE_OTHER)

    assert str(adventure) == 'Super Adventure'
