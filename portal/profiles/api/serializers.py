from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

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
    nickname = serializers.CharField(source='username',
                                     validators=[UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'nickname', )


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = ('id', 'user', 'dci')

    def update(self, instance, validated_data):
        try:
            user_data = validated_data.pop('user')
        except KeyError:
            pass
        else:
            user = instance.user

            instance.dci = validated_data.get('dci', instance.dci)
            instance.save()

            UserSerializer().update(instance.user, user_data)

        return instance
