from django import forms

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "company", "message"]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "placeholder": "Your name",
                    "autocomplete": "name",
                }
            ),
            "email": forms.EmailInput(
                attrs={
                    "placeholder": "you@company.com",
                    "autocomplete": "email",
                }
            ),
            "company": forms.TextInput(
                attrs={
                    "placeholder": "Company or team",
                    "autocomplete": "organization",
                }
            ),
            "message": forms.Textarea(
                attrs={
                    "placeholder": "Tell me what you are building...",
                    "rows": 6,
                }
            ),
        }

    def clean_message(self):
        message = self.cleaned_data["message"].strip()

        if len(message) < 20:
            raise forms.ValidationError(
                "Please provide at least 20 characters so I can understand your request."
            )

        return message
