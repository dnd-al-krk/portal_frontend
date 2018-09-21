from django_filters import rest_framework as filters

from ..models import Adventure


class AdventureFilter(filters.FilterSet):

    class Meta:
        model = Adventure
        fields = ('season', 'number', 'type',)
