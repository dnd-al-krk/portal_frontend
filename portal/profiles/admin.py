from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from django.utils.translation import ugettext_lazy as _

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
from .constants import ROLE_DM, ROLE_PLAYER
from .models import Profile, CharacterFaction, CharacterRace, CharacterClass, PlayerCharacter, DMNote


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = _('Profiles')
    max_num = 1
    min_num = 1


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, )
    actions = ['make_dm', 'make_player']

    def make_dm(self, request, queryset):
        for user in queryset:
            user.profile.role = ROLE_DM
            user.profile.save(update_fields=['role'])
        self.message_user(request, _("{} successfully changed roles to DM.").format(queryset.count()))

    make_dm.short_description = _('Change role to DM')

    def make_player(self, request, queryset):
        for user in queryset:
            user.profile.role = ROLE_PLAYER
            user.profile.save(update_fields=['role'])
        self.message_user(request, _("{} successfully changed roles to Player.").format(queryset.count()))

    make_player.short_description = _('Change role to Player')


admin.site.unregister(User)
admin.site.register(User, UserAdmin)


admin.site.register(CharacterClass)
admin.site.register(CharacterRace)
admin.site.register(CharacterFaction)


@admin.register(PlayerCharacter)
class PlayerCharacterAdmin(admin.ModelAdmin):
    list_display = ['name', 'level', 'race', 'pc_class', 'faction']
    search_fields = ['name', ]
    list_filter = ['level', 'race', 'pc_class', 'faction']


@admin.register(DMNote)
class DMNoteAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'dm', 'player', 'created']
    list_filter = ['created']
