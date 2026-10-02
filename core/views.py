from datetime import date

from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse

from .forms import ContactForm


PROFILE = {
    "name": "Samyog Panthi",
    "role": "Python / Django Backend Developer",
    "status": "Open to internships and junior backend roles",
    "location": "Gulmi, Tamghas, Nepal",
    "phone": "9769296077",
    "email": "samyogpanthee238@gmail.com",
    "education": "BEIT student at Nepal College of Information Technology",
    "github": "https://github.com/samyog123-lang",
    "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Samyog%20Panthi",
    "facebook": "https://www.facebook.com/",
    "instagram": "https://www.instagram.com/samyogpanthee238/",
}


SKILLS = [
    {
        "name": "Python",
        "level": "Backend foundation",
        "class": "skill-python",
    },
    {
        "name": "Django",
        "level": "Primary framework",
        "class": "skill-django",
    },
    {
        "name": "Flask",
        "level": "Microframework",
        "class": "skill-flask",
    },
    {
        "name": "Django ORM",
        "level": "Data modeling",
        "class": "skill-orm",
    },
    {
        "name": "SQLite",
        "level": "Database practice",
        "class": "skill-sqlite",
    },
    {
        "name": "HTML / CSS",
        "level": "Frontend foundation",
        "class": "skill-html",
    },
    {
        "name": "JavaScript",
        "level": "Interactive UI",
        "class": "skill-js",
    },
    {
        "name": "Git / GitHub",
        "level": "Project workflow",
        "class": "skill-git",
    },
]


PROJECTS = [
    {
        "number": "01",
        "title": "To-do Application",
        "type": "Django productivity application",
        "description": (
            "A practical task-management project focused on CRUD workflows, "
            "templates, forms, routing, and database-backed user actions."
        ),
        "proof": "Shows that I can turn a simple product idea into a working Django application.",
        "tags": ["Django", "SQLite", "CRUD"],
        "url": "https://github.com/samyog123-lang/To-do-app",
        "image": "todo.png",
        "accent": "orange",
    },
    {
        "number": "02",
        "title": "E-commerce Platform",
        "type": "Django commerce project",
        "description": (
            "An e-commerce project exploring product workflows, database models, "
            "templates, and the backend structure required by online stores."
        ),
        "proof": "Shows backend thinking around products, users, and business workflows.",
        "tags": ["Django", "ORM", "Database"],
        "url": "https://github.com/samyog123-lang/E-commerce-Django",
        "image": "ecommerce.png",
        "accent": "blue",
    },
    {
        "number": "03",
        "title": "Blog Website",
        "type": "Content publishing platform",
        "description": (
            "A blog website built to practice content models, dynamic templates, "
            "routing, reusable views, and database-powered pages."
        ),
        "proof": "Shows that I understand how backend data becomes a usable product experience.",
        "tags": ["Django", "Templates", "Models"],
        "url": "https://github.com/samyog123-lang/It-s-me-Samyog--Samyog-Blog-Website",
        "image": "blog.png",
        "accent": "lime",
    },
    {
        "number": "04",
        "title": "School Website",
        "type": "Institutional web project",
        "description": (
            "A school website project created for Shree Resunga Secondary School, "
            "combining structured content, responsive pages, and practical web design."
        ),
        "proof": "Shows ownership, communication, and the ability to build for a real-world context.",
        "tags": ["Python", "Flask", "Responsive UI"],
        "url": "https://github.com/samyog123-lang/Shree-ResungaSec.School-Website",
        "image": "school.png",
        "accent": "yellow",
    },
]


def home(request):
    form = ContactForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(
            request,
            "Your message has been received. I will get back to you soon.",
        )
        return redirect(f"{reverse('core:home')}#contact")

    context = {
        "profile": PROFILE,
        "skills": SKILLS,
        "projects": PROJECTS,
        "form": form,
        "current_year": date.today().year,
    }

    return render(request, "core/home.html", context)


def resume(request):
    context = {
        "profile": PROFILE,
        "skills": SKILLS,
        "projects": PROJECTS,
        "current_year": date.today().year,
    }

    return render(request, "core/resume.html", context)
