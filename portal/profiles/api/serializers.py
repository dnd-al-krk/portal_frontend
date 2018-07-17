from django.contrib.auth.models import User
from rest_framework import serializers

from ..models import PlayerCharacter, DMNote, Profile


class PlayerCharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCharacter
        fields = ('id', 'name', 'pc_class', 'race', 'faction', 'level', )


class DMNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DMNote
        fields = ('id', 'player', 'note', )


class UserSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(source='username')

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'nickname', )


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ('id', 'user', 'dci')
