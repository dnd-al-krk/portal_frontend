from rest_framework import serializers

from ..models import Adventure, GameSession


class AdventureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adventure
        fields = ('id', 'title', 'season', 'number', 'type')


class GameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = (
            'id',
            'date',
            'table',
            'adventure',
        )


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
