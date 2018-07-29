import logging

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from ..models import PlayerCharacter, DMNote, Profile


logger = logging.getLogger(__name__)


class PlayerCharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCharacter
        fields = ('id', 'name', 'pc_class', 'race', 'faction', 'level', )


class DMNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DMNote
        fields = ('id', 'player', 'note', )


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ('id', 'first_name', 'last_name', )


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ('id', 'user', 'nickname', 'dci')

    def update(self, instance, validated_data):
        try:
            user_data = validated_data.pop('user')
        except KeyError:
            pass
        else:
            instance.dci = validated_data.get('dci', instance.dci)
            instance.nickname = validated_data.get('nickname', instance.nickname)
            instance.save()

            UserSerializer().update(instance=instance.user, validated_data=user_data)

        return instance
