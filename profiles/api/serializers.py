import logging

from django.contrib.auth import get_user_model
from rest_framework import serializers

from ..models import PlayerCharacter, DMNote, Profile, CharacterClass, CharacterRace, CharacterFaction

logger = logging.getLogger(__name__)


class CharacterClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterClass
        fields = ('id', 'name')


class CharacterRaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterRace
        fields = ('id', 'name')


class CharacterFactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterFaction
        fields = ('id', 'name')


class PlayerCharacterSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlayerCharacter
        fields = ('id', 'name', 'pc_class', 'race', 'faction', 'level', 'created', 'modified', )


class PlayerCharacterListSerializer(serializers.ModelSerializer):
    pc_class = serializers.SerializerMethodField()
    race = serializers.SerializerMethodField()
    faction = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()

    def get_owner_name(self, obj):
        return str(obj.owner)

    def get_pc_class(self, obj):
        return str(obj.pc_class)

    def get_race(self, obj):
        return str(obj.race)

    def get_faction(self, obj):
        return str(obj.faction)

    class Meta:
        model = PlayerCharacter
        fields = ('id', 'owner', 'owner_name', 'name', 'pc_class', 'race', 'faction', 'level', 'created', 'modified', )


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
    role = serializers.SerializerMethodField()
    characters_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('id', 'user', 'nickname', 'dci', 'role', 'characters_count')

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

    def get_role(self, obj):
        return obj.get_role_display()

    def get_characters_count(self, obj):
        return obj.characters.all().count()
