from rest_framework import serializers

from profiles.api.serializers import PublicProfileSerializer, PublicPlayerCharacterSerializer
from ..models import Adventure, GameSession, GameSessionPlayerSignUp


class AdventureSerializer(serializers.ModelSerializer):
    title_display = serializers.SerializerMethodField()

    class Meta:
        model = Adventure
        fields = ('id', 'title', 'season', 'number', 'type', 'title_display')

    def get_title_display(self, adventure):
        return str(adventure)


class GameSessionPlayerSignUpSerializer(serializers.ModelSerializer):
    profile = PublicProfileSerializer(source='player', read_only=True)
    character = PublicPlayerCharacterSerializer()

    class Meta:
        model = GameSessionPlayerSignUp
        fields = ('profile', 'character',)


class GameSessionSerializer(serializers.ModelSerializer):
    table_name = serializers.CharField(source='table.name', read_only=True)
    dm = PublicProfileSerializer(read_only=True)
    players = GameSessionPlayerSignUpSerializer(many=True, source='gamesessionplayersignup_set', read_only=True)
    adventure = AdventureSerializer()
    time_start = serializers.SerializerMethodField()
    time_end = serializers.SerializerMethodField()
    max_spots = serializers.IntegerField(source='table.max_spots', read_only=True)

    class Meta:
        model = GameSession
        fields = (
            'id',
            'date',
            'table_name',
            'adventure',
            'dm',
            'players',
            'time_start',
            'time_end',
            'notes',
            'spots',
            'max_spots',
            'ended',
        )

    def get_time_start(self, game):
        return game.time_start.strftime('%H:%M') if game.time_start else ''

    def get_time_end(self, game):
        return game.time_end.strftime('%H:%M') if game.time_end else ''


class GameSessionBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = (
            'id',
            'dm',
            'adventure',
            'time_start',
            'time_end',
            'spots',
            'notes',
        )
