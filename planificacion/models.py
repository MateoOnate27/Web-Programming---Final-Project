from django.contrib.auth.models import AbstractUser
from django.db import models

#===============================================================================================================#

class Rol(models.Model):
    nombre = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.nombre

class Usuario(AbstractUser):
    CONTRATO_CHOICES = [
        ('titular', 'Titular'),
        ('ocasional', 'Ocasional'),
        ('tiempo completo', 'Tiempo Completo'),
    ]

    cedula = models.CharField(max_length=10, unique=True)
    escuela = models.TextField()
    tipo_contrato = models.CharField(max_length=20, choices=CONTRATO_CHOICES)
    activo = models.BooleanField(default=True)
    roles = models.ManyToManyField(Rol)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'  # Usar el correo para iniciar sesión
    REQUIRED_FIELDS = ['username']  # Se requiere 'username', pero se usa email para el login

    def __str__(self):
        return f"{self.username}"

#===============================================================================================================#

class PeriodoAcademico(models.Model):
    nombre_periodo = models.TextField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    numero_semanas = models.IntegerField()

    def __str__(self):
        return self.nombre_periodo

#===============================================================================================================#

class Planificacion(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    periodo = models.ForeignKey(PeriodoAcademico, on_delete=models.CASCADE)
    version = models.IntegerField(default=1)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES)
    comentarios_decano = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.periodo.nombre_periodo} (v{self.version})"

#===============================================================================================================#

class Actividad(models.Model):
    FUNCION_CHOICES = [
        ('docencia', 'Docencia'),
        ('investigacion', 'Investigación'),
        ('vinculacion', 'Vinculación'),
        ('gestion', 'Gestión'),
    ]

    funcion_sustantiva = models.CharField(max_length=20, choices=FUNCION_CHOICES)
    codigo_item = models.CharField(max_length=10)
    descripcion = models.TextField(blank=True, null=True)
    horas_max_periodo = models.IntegerField(blank=True, null=True)
    horas_max_semanal = models.IntegerField(blank=True, null=True)
    evidencia_requerida = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.codigo_item} - {self.funcion_sustantiva.capitalize()}"
#===============================================================================================================#

class DetalleActividad(models.Model):
    planificacion = models.ForeignKey(Planificacion, on_delete=models.CASCADE)
    actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE)
    producto_esperado = models.TextField(blank=True, null=True)
    justificacion = models.TextField(blank=True, null=True)
    horas_asignadas = models.IntegerField()
    horas_periodo = models.IntegerField()

    def __str__(self):
        return f"{self.planificacion} - {self.actividad.codigo_item}"

#===============================================================================================================#

class Evidencia(models.Model):
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    detalle_actividad = models.ForeignKey(DetalleActividad, on_delete=models.CASCADE)
    # Usar FileField o ImageField para subir archivos
    nombre_archivo = models.FileField(upload_to='evidencias/')
    url_archivo = models.URLField(blank=True, null=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evidencia: {self.nombre_archivo}"

#===============================================================================================================#

class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notificación para {self.usuario.username} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"

#===============================================================================================================#