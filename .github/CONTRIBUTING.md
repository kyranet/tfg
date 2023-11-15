# Cómo contribuir

Para contribuir a este repositorio, sé libre de
[bifurcar](https://docs.github.com/es/get-started/quickstart/fork-a-repo) ("fork") el repositorio y subir una
[solicitud de incorporación de cambios](https://docs.github.com/es/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
("pull request"). Sugerimos el instalar [ESLint](https://eslint.org) en su editor de texto o IDE de su elección para
asegurarse de que GitHub Actions no genere un error.

1. Bifurca, clona, y selecciona la rama **main**.
1. Crea una nueva rama en su bifurcación.
1. Haga sus cambios.
1. Asegúrese de que el lint y el build funcionen con `yarn lint && yarn build`.
1. Confirma sus cambios y súbalos.
1. ¡Crea un Pull Request!

## Ejecutando los proyectos localmente

1. Instala [Node.js](https://nodejs.org), [Yarn](https://yarnpkg.com) y [Docker](https://www.docker.com/), recomendamos
   usar [Volta](https://volta.sh).
1. Copia y pega `.env.example` comp `.env`.
1. Genere una clave de 32 caracteres y cópielo como valor de `NITRO_AUTH_PASSWORD`.
1. Inicie el servidor de [MariaDB][] si aún no lo hizo, [¿cómo?](#inicializando-mariadb).
1. Inicie el servidor de desarrollo de la web con `yarn dev`.

## Inicializando MariaDB

Si usted cuenta con un servidor [MariaDB][] activo, puede usarlo y saltar esta sección. En caso opuesto, tiene varias
opciones.

La forma más sencilla es usando el comando [`docker-compose`](https://docs.docker.com/compose/), ejecutando
`docker-compose up -d db`.

La alternativa es [descargar el servidor](https://mariadb.org/download), siguiendo los pasos de la página web.

Una vez tenga MariaDB activo, modifique las variables de entorno de su `.env` en caso de ser necesario:

- `NITRO_DB_HOST`
- `NITRO_DB_PORT`
- `NITRO_DB_USER`
- `NITRO_DB_PASSWORD`
- `NITRO_DB_DATABASE`

[MariaDB]: https://mariadb.org
