# Memes y Chistes - API y Plataforma

📄 Descripción
"Memes y Chistes" es una plataforma divertida y única para desarrolladores y entusiastas de los memes. Este proyecto ofrece APIs categorizadas con memes y chistes que pueden ser utilizados en otras aplicaciones, además de un sitio web interactivo donde los usuarios pueden explorar, votar y compartir contenido.

✨ Características

APIs para Memes y Chistes: Categorías como "Memes de Programadores", "Memes de Barbie" y "Memes Uruguayos".

Votaciones: Los usuarios pueden votar por sus memes favoritos, generando rankings mensuales y anuales.

Panel de Administración: Los administradores pueden agregar, editar o eliminar memes y chistes.

Base de Datos MySQL: Almacena la información de memes, votaciones y usuarios.

Frontend Interactivo: Navegación fácil y visualización de las categorías con Angular 19.

Autenticación con JWT: Sistema seguro de inicio de sesión para usuarios y administradores.

☁️ Interacción con la API
El backend, desarrollado con Node.js y Express, permite manejar peticiones para obtener, votar y gestionar los memes en la base de datos.

💻 Tecnologías Utilizadas

Frontend:

Angular 19

Tailwind CSS

SCSS

Backend:

Node.js

Express.js

MySQL

JWT para autenticación

Nodemon para desarrollo

📋 Requisitos

Node.js y npm instalados en tu sistema. Puedes descargarlos desde nodejs.org.

Angular CLI instalado globalmente:

npm install -g @angular/cli

🛠️ Instalación

Clona este repositorio:

git clone https://github.com/pmiramonteso/memes_project.git

Ingresa al directorio del proyecto:

cd memes_project

Instala las dependencias del backend y frontend:

npm install
cd backend
npm install

Configura el archivo .env con los datos de tu base de datos MySQL. Puedes usar el archivo .env.ejemplo como referencia:

DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_tu_base_de_datos
JWT_SECRET=tu_jwt_secret

Para generar un JWT_SECRET, ejecuta en la terminal:

openssl rand -hex 32

🖥️ Ejecución

Levanta el servidor del backend:

cd backend
npm run dev

Levanta la aplicación Angular:

cd memes_project
ng serve -o

🤝 Contribuciones
Si deseas colaborar en este proyecto o informar sobre problemas, crea un "issue" o envía un "pull request".

📧 Contacto
Paola Miramontes – pmiramonteso@gmail.com
