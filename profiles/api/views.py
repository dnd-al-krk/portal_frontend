from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsOwnerOrReadOnly, IsDMOwnerOrReadOnly, OnlyDMCanRead, IsProfileOwnerOrReadOnly
from .serializers import PlayerCharacterSerializer, DMNoteSerializer, ProfileSerializer
from ..models import PlayerCharacter, DMNote, Profile


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
