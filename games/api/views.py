from rest_framework import viewsets, mixins
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters

from ..models import Adventure
from .filters import AdventureFilter
from .serializers import AdventureSerializer


class AdventuresViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = AdventureSerializer
    queryset = Adventure.objects.all()
    permission_classes = [IsAuthenticated,]
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_class = AdventureFilter
    search_fields = ('title', )
    ordering_fields = ('season', 'number', 'title',)
    ordering = ('season', 'number', 'title', )
