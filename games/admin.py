from django.contrib import admin

from .models import Table, Adventure, GameSession, GameSessionPlayerSignUp


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['name', 'max_spots']


@admin.register(Adventure)
class AdventureAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'season', 'number']
    list_filter = ['season', 'type']


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ['date', 'table', 'adventure', 'time_start', 'spots', 'max_spots', 'dm']
    list_filter = ['date', 'adventure__season', 'adventure__type', 'adventure__number',
                   'spots', 'table__max_spots']
    search_fields = [
        'adventure__title', 'table__name',
        'dm__nickname', 'dm__user__first_name', 'dm__user__last_name',
    ]

    def max_spots(self, session):
        return session.table.max_spots


@admin.register(GameSessionPlayerSignUp)
class GameSessionPlayerSignUpAdmin(admin.ModelAdmin):
    list_display = ['created', 'game', 'player']
    list_filter = ['game__date', 'game__adventure__season', 'game__adventure__type', 'game__adventure__number',
                   'game__spots']
