from rest_framework import viewsets, mixins
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters import rest_framework as filters

from .filters import PlayerCharacterFilter
from .permissions import IsOwnerOrReadOnly, IsDMOwnerOrReadOnly, OnlyDMCanRead, IsProfileOwnerOrReadOnly
from .serializers import (PlayerCharacterSerializer, DMNoteSerializer, ProfileSerializer, CharacterClassSerializer,
                          CharacterRaceSerializer, CharacterFactionSerializer, PlayerCharacterListSerializer)
from ..models import PlayerCharacter, DMNote, Profile, CharacterClass, CharacterRace, CharacterFaction


class PlayerCharacterViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerCharacterSerializer
    queryset = PlayerCharacter.objects.all()
    permission_classes = [IsAuthenticated,
                          IsOwnerOrReadOnly]
    filter_backends = (filters.DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_class = PlayerCharacterFilter
    search_fields = ('name', 'owner__nickname')
    ordering_fields = ('name', 'level', 'created', 'modified')
    ordering = '-created'
    #
    # def get_queryset(self):
    #     return PlayerCharacter.objects.filter(owner=self.request.user.profile)

    def get_serializer_class(self):
        if self.action == 'list':
            return PlayerCharacterListSerializer
        return PlayerCharacterSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user.profile)


class DMNoteViewSet(viewsets.ModelViewSet):
    serializer_class = DMNoteSerializer
    queryset = DMNote.objects.all()
    permission_classes = [IsAuthenticated,
                          IsDMOwnerOrReadOnly,
                          OnlyDMCanRead]

    def perform_create(self, serializer):
        serializer.save(dm=self.request.user.profile)


class ProfileViewSet(mixins.UpdateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.ListModelMixin,
                     viewsets.GenericViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated,
                          IsProfileOwnerOrReadOnly]


class CurrentUserView(APIView):
    def get(self, request):
        serializer = ProfileSerializer(request.user.profile)
        return Response(serializer.data)


class CharacterClassListView(mixins.ListModelMixin,
                             viewsets.GenericViewSet):
    serializer_class = CharacterClassSerializer
    queryset = CharacterClass.objects.all()
    permission_classes = [IsAuthenticated]


class CharacterRaceListView(mixins.ListModelMixin,
                            viewsets.GenericViewSet):
    serializer_class = CharacterRaceSerializer
    queryset = CharacterRace.objects.all()
    permission_classes = [IsAuthenticated]


class CharacterFactionListView(mixins.ListModelMixin,
                               viewsets.GenericViewSet):
    serializer_class = CharacterFactionSerializer
    queryset = CharacterFaction.objects.all()
    permission_classes = [IsAuthenticated]
