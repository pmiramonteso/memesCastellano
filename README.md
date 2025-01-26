# Memes y Chistes - API y Plataforma

# 📄 Descripción
"La sociedad del MEME" es una plataforma divertida y única para desarrolladores que quieran ponerle un poco de humor a su web. Este proyecto ofrece una API en la cual encontrarás categorias con memes que pueden ser votados para ir creando categorias con los mejores memes. Es una herramienta que he podido crear pero que gracias a la participación, la creamos entre la comunidad.

# ✨ Características

API para Memes: Categorías como "Memes de Programadores", "Memes de Barbie" y "Memes de gatos".

Votaciones: Los usuarios pueden votar por sus memes favoritos, generando rankings mensuales y anuales.

Panel de Administración: Los administradores pueden agregar, editar o eliminar memes.

Base de Datos MySQL: Almacena la información de memes, votaciones y usuarios.

Frontend Interactivo: Navegación fácil y visualización de las categorías con Angular 19.

Autenticación con JWT: Sistema seguro de inicio de sesión para usuarios y administradores.

# ☁️ Interacción con la API
El backend, desarrollado con Node.js y Express, permite manejar peticiones para obtener, votar y gestionar los memes en la base de datos.

# 💻 Tecnologías Utilizadas

# Frontend:

Angular 19

Tailwind CSS

SCSS

# Backend:

Node.js

Express.js

MySQL

JWT para autenticación

Nodemon para desarrollo

# 📋 Requisitos

Node.js y npm instalados en tu sistema. Puedes descargarlos desde nodejs.org.

Angular CLI instalado globalmente:

npm install -g @angular/cli

# 🛠️ Instalación

Clona este repositorio:

git clone https://github.com/pmiramonteso/memesCastellano.git

Ingresa al directorio del proyecto:

cd memesCastellano

Instala las dependencias del backend y frontend:

npm install
cd backend
npm install

Configura el archivo .env con los datos de tu base de datos MySQL. Puedes usar el archivo .env.ejemplo como referencia:

DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=proj_memes
JWT_SECRET=tu_jwt_secret

Para generar un JWT_SECRET, ejecuta en la terminal:

openssl rand -hex 32

#  🖥️ Ejecución

Levanta el servidor del backend:

cd backend
npm run dev

Levanta la aplicación Angular:

cd memes_project
ng serve -o

# 🤝 Contribuciones
Si deseas colaborar en este proyecto o informar sobre problemas, crea un "issue" o envía un "pull request".
Tambien puedes ¡y debes! enviarme los memes que más te gusten para incluirlos en el proyecto.

# 📧 Contacto
Paola Miramontes – pmiramonteso@gmail.com
