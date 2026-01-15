Full-Stack Recipe App (Django + React + Docker)

A containerized full-stack web application with a Django REST API backend and a React (Vite) frontend.

Clone the repo:
```bash
git clone https://github.com/binitkarki/RECIPE-react-django-.git
cd RECIPE-react-django-



docker exec -it django_backend python manage.py migrate
docker exec -it django_backend python manage.py loaddata recipes/fixtures/initial_recipes.json
