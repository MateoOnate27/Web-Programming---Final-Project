from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, RolViewSet, PeriodoAcademicoViewSet,
    PlanificacionViewSet, ActividadViewSet, DetalleActividadViewSet,
    EvidenciaViewSet, NotificacionViewSet, vista_protegida, informe_resumen
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'roles', RolViewSet)
router.register(r'periodos', PeriodoAcademicoViewSet)
router.register(r'planificaciones', PlanificacionViewSet, basename='planificaciones')
router.register(r'actividades', ActividadViewSet)
router.register(r'detalles', DetalleActividadViewSet, basename='detalleactividad')
router.register(r'evidencias', EvidenciaViewSet, basename='evidencia')
router.register(r'notificaciones', NotificacionViewSet, basename='notificacion')

urlpatterns = [
    path('', include(router.urls)),
    path('protegida/', vista_protegida),  # Vista protegida
    path('api/informe_resumen/', informe_resumen),
]