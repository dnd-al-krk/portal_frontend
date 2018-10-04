from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from rest_framework.response import Response

from ..models import Adventure, GameSession, GameSessionPlayerSignUp
from .filters import AdventureFilter, GameSessionFilter
from .serializers import AdventureSerializer, GameSessionSerializer, GameSessionBookSerializer


class AdventuresViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = AdventureSerializer
    queryset = Adventure.objects.all()
    permission_classes = [IsAuthenticated, ]
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_class = AdventureFilter
    search_fields = ('title', )
    ordering_fields = ('season', 'number', 'title',)
    ordering = ('season', 'number', 'title', )


class GameSessionViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin,
                         viewsets.GenericViewSet):
    serializer_class = GameSessionSerializer
    queryset = GameSession.objects.all()
    permission_classes = [IsAuthenticated, ]
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_class = GameSessionFilter
    search_fields = (
        'table__name',
        'dm__user__first_name', 'dm__user__last_name', 'dm__nickname',
        'adventure__title',
    )
    ordering_fields = ('date', )
    ordering = 'date'

    @action(methods=['PUT'], detail=True)
    def signUp(self, request, *args, **kwargs):

        instance = self.get_object()
        profile = request.user.profile

        if not instance.can_sign_up(profile):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        GameSessionPlayerSignUp.objects.create(
            game=instance,
            player=profile,
        )
        return Response()

    @action(methods=['PUT'], detail=True)
    def signOut(self, request, *args, **kwargs):
        instance = self.get_object()
        profile = request.user.profile

        if not instance.can_sign_out(profile):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            signup = GameSessionPlayerSignUp.objects.get(
                game=instance,
                player=profile
            )
            signup.delete()
            return Response()
        except GameSessionPlayerSignUp.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class GameSessionBookViewSet(mixins.UpdateModelMixin,
                             viewsets.GenericViewSet):
    serializer_class = GameSessionBookSerializer
    queryset = GameSession.objects.all()
    permission_classes = [IsAuthenticated, ]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.adventure:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return super(GameSessionBookViewSet, self).update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save(dm=self.request.user.profile)
