from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

from .permissions import IsOwnerOrReadOnly, IsDMOwnerOrReadOnly, OnlyDMCanRead
from .serializers import PlayerCharacterSerializer, DMNoteSerializer
from ..models import PlayerCharacter, DMNote


class PlayerCharacterViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerCharacterSerializer
    queryset = PlayerCharacter.objects.all()
    permission_classes = [IsAuthenticated,
                          IsOwnerOrReadOnly]

    def get_queryset(self):
        return PlayerCharacter.objects.filter(owner=self.request.user.profile)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)


class DMNoteViewSet(viewsets.ModelViewSet):
    serializer_class = DMNoteSerializer
    queryset = DMNote.objects.all()
    permission_classes = [IsAuthenticated,
                          IsDMOwnerOrReadOnly,
                          OnlyDMCanRead]

    def perform_create(self, serializer):
        serializer.save(dm=self.request.user.profile)
