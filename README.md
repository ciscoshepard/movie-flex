# MovieFlex

MovieFlex est une application de streaming de films et séries, inspirée de Netflix, utilisant l'API The Movie Database (TMDB).

## Fonctionnalités

- Interface utilisateur moderne et responsive
- Thème sombre
- Navigation intuitive
- Recherche de films et séries
- Catégories de contenu
- Lecture de bandes-annonces
- Système de notation
- Authentification utilisateur

## Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/votre-username/movie-flex.git
cd movie-flex
```

2. Installez les dépendances :

```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :

```
REACT_APP_TMDB_API_KEY=votre_clé_api_tmdb
REACT_APP_MONGODB_URI=votre_uri_mongodb
```

4. Lancez l'application en mode développement :

```bash
npm start
```

## Structure du projet

```
movie-flex/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── assets/
├── src/
│   ├── components/
│   │   ├── AppBar.tsx
│   │   ├── SideBar.tsx
│   │   └── CenterScreen.tsx
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── README.md
```

## Technologies utilisées

- React
- TypeScript
- Material-UI
- Axios
- MongoDB
- TMDB API

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT.
