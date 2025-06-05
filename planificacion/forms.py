# planificacion/forms.py

from django import forms
from .models import Planificacion

class PlanificacionForm(forms.ModelForm):
    class Meta:
        model = Planificacion
        fields = ['periodo']  # Ajusta si quieres más campos
        widgets = {
            'periodo': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'periodo': 'Periodo Académico',
        }   
        help_texts = {
            'periodo': 'Selecciona el periodo académico para la planificación.',
        }
        error_messages = {
            'periodo': {
                'required': 'Este campo es obligatorio.',
            },
        }
class PlanificacionFormSet(forms.BaseFormSet):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.queryset = Planificacion.objects.none()  # Evita que se muestren instancias existentes
    def clean(self):
        if any(self.errors):
            return
        # Aquí puedes agregar validaciones personalizadas si es necesario
        for form in self.forms:
            if not form.cleaned_data.get('periodo'):
                raise forms.ValidationError('El periodo académico es obligatorio.')
        # Puedes agregar más validaciones según tus necesidades
    def save(self, commit=True):
        instances = super().save(commit=False)
        if commit:
            for instance in instances:
                instance.save()
        return instances
class PlanificacionFormSetFactory:
    @staticmethod
    def create_formset(queryset=None, **kwargs):
        formset = forms.formset_factory(
            PlanificacionForm,
            formset=PlanificacionFormSet,
            extra=1,  # Número de formularios adicionales
            max_num=10,  # Número máximo de formularios
            min_num=1,  # Número mínimo de formularios
            validate_min=True,
            validate_max=True,
            can_delete=True,
        )
        return formset(queryset=queryset, **kwargs)
