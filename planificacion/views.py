from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser  # Para manejar archivos
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Sum, Q
from rest_framework.authtoken.models import Token


from .models import (
    Usuario, Rol, PeriodoAcademico, Planificacion,
    Actividad, DetalleActividad, Evidencia, Notificacion
)

from .serializers import (
    UsuarioSerializer, RolSerializer, PeriodoAcademicoSerializer,
    PlanificacionSerializer, ActividadSerializer,
    DetalleActividadSerializer, EvidenciaSerializer,
    NotificacionSerializer, CustomAuthTokenSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class PeriodoAcademicoViewSet(viewsets.ModelViewSet):
    queryset = PeriodoAcademico.objects.all()
    serializer_class = PeriodoAcademicoSerializer

class PlanificacionViewSet(viewsets.ModelViewSet):
    serializer_class = PlanificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.roles.filter(nombre='decano').exists():
            return Planificacion.objects.all()
        else:
            return Planificacion.objects.filter(usuario=user)
        
    def perform_create(self, serializer):
        # Asigna el usuario autenticado automáticamente
        serializer.save(usuario=self.request.user)

class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer
    permission_classes = [IsAuthenticated]

class DetalleActividadViewSet(viewsets.ModelViewSet):
    serializer_class = DetalleActividadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.roles.filter(nombre='decano').exists():
            return DetalleActividad.objects.all()
        else:
            return DetalleActividad.objects.filter(planificacion__usuario=user)

    def perform_create(self, serializer):
        serializer.save()

class EvidenciaViewSet(viewsets.ModelViewSet):
    serializer_class = EvidenciaSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        user = self.request.user
        if user.roles.filter(nombre='decano').exists():
            return Evidencia.objects.all()
        else:
            return Evidencia.objects.filter(usuario=user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class NotificacionViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.roles.filter(nombre='decano').exists():
            return Notificacion.objects.all()
        else:
            return Notificacion.objects.filter(usuario=user)

class ObtainAuthToken(APIView):
    permission_classes = [AllowAny]  # Permitimos acceso sin autenticación

    def post(self, request, *args, **kwargs):
        # Serialize and authenticate the user
        serializer = CustomAuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Imprimir el token generado en los logs para verificar
        print(f"Token generado para {user.username}: {token.key}")
        

        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        if created:
            print("El token fue creado.")
        else:
            print("El token ya existía.")
        return Response({
            'token': token.key,
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vista_protegida(request):
    """
    Vista protegida que solo puede ser accedida por usuarios autenticados.
    """
    return Response({
        "mensaje": f"¡Hola, {request.user.username}! Estás autenticado correctamente.",
        "username": request.user.username,
        "email": request.user.email,
        "cedula": request.user.cedula,
        "escuela": request.user.escuela,
        "roles": [rol.nombre for rol in request.user.roles.all()]
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def informe_resumen(request):
    user = request.user

    # Obtén la planificación actual o activa del usuario
    planificaciones = Planificacion.objects.filter(usuario=user)

    if not planificaciones.exists():
        return Response({
            "mensaje": "No tienes planificaciones registradas."
        })

    periodo = planificaciones.first().periodo

    # Suma las horas por función sustantiva en las actividades detalladas del usuario
    resumen = DetalleActividad.objects.filter(
        planificacion__usuario=user,
        planificacion__periodo=periodo
    ).values('actividad__funcion_sustantiva').annotate(total_horas=Sum('horas_asignadas'))

    resumen_dict = {
        'docencia': 0,
        'investigacion': 0,
        'vinculacion': 0,
        'gestion': 0,
        'total': 0,
    }

    for item in resumen:
        func = item['actividad__funcion_sustantiva']
        horas = item['total_horas'] or 0
        resumen_dict[func] = horas
        resumen_dict['total'] += horas

    data = {
        "docente": user.username,
        "cedula": user.cedula,
        "escuela": user.escuela,
        "periodo": periodo.nombre_periodo,
        "numero_semanas": periodo.numero_semanas,
        "resumen_actividades": resumen_dict,
        "observaciones": planificaciones.first().comentarios_decano or ""
    }

    return Response(data)


