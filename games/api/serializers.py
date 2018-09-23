from rest_framework import serializers

from profiles.api.serializers import PublicProfileSerializer
from ..models import Adventure, GameSession


class AdventureSerializer(serializers.ModelSerializer):
    title_display = serializers.SerializerMethodField()

    class Meta:
        model = Adventure
        fields = ('id', 'title', 'season', 'number', 'type', 'title_display')

    def get_title_display(self, adventure):
        return str(adventure)


class GameSessionSerializer(serializers.ModelSerializer):
    table_name = serializers.CharField(source='table.name', read_only=True)
    dm = PublicProfileSerializer()
    adventure = AdventureSerializer()
    time_start = serializers.SerializerMethodField()

    class Meta:
        model = GameSession
        fields = (
            'id',
            'date',
            'table_name',
            'adventure',
            'dm',
            'time_start',
            'notes',
            'spots',
        )

    def get_time_start(self, game):
        return game.time_start.strftime('%H:%M') if game.time_start else ''


class GameSessionBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = (
            'id',
            'dm',
            'adventure',
            'time_start',
            'spots',
            'notes',
        )
