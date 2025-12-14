from django import forms
from .models import CallbackRequest

class CallbackForm(forms.ModelForm):
    class Meta:
        model = CallbackRequest
        fields = ['name', 'phone', 'message', 'consent', 'service']
        widgets = {
            'service': forms.HiddenInput(),
            'name': forms.TextInput(attrs={
                'placeholder': 'Ваше имя',
                'required': True
            }),
            'phone': forms.TextInput(attrs={
                'placeholder': '+7 (___) ___-__-__',
                'required': True
            }),
            'message': forms.Textarea(attrs={
                'placeholder': 'Дополнительная информация...',
                'rows': 4
            }),
        }