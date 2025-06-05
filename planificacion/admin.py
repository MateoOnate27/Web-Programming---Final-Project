from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Rol, PeriodoAcademico, Planificacion, Actividad, DetalleActividad, Evidencia, Notificacion

@admin.register(Usuario)
class CustomUserAdmin(UserAdmin):
    model = Usuario
    list_display = ('username', 'email', 'cedula', 'escuela', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'roles')
    search_fields = ('username', 'email', 'cedula')
    ordering = ('username',)

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'cedula', 'escuela', 'tipo_contrato', 'roles')}),
        ('Permisos', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'cedula', 'escuela', 'tipo_contrato', 'roles', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

admin.site.register(Rol)
admin.site.register(PeriodoAcademico)
admin.site.register(Planificacion)
admin.site.register(Actividad)
admin.site.register(DetalleActividad)
admin.site.register(Evidencia)
admin.site.register(Notificacion)

