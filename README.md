
# Hello Service - VenteService

## Description
Hello Service est une application web full-stack permettant aux utilisateurs de sélectionner des services professionnels (comme l'audit, le conseil, le coaching, etc.) et de soumettre leurs informations personnelles pour une demande personnalisée. Le projet est composé d'un frontend statique basé sur HTML, CSS (avec Material Design Lite) et JavaScript, ainsi d'un backend léger construit avec Node.js.

## Fonctionnalités
- Affichage d'une liste de services et de leurs modules (tirée de `services.json`).
- Interface interactive avec une barre de progression pour guider l'utilisateur.
- Formulaire en deux étapes pour collecter les informations personnelles (nom et email).
- Soumission des données (actuellement en développement).

## Prérequis
- **Node.js** : Version 14.x ou supérieure (recommandée : LTS).
- Un environnement de développement (ex. : Visual Studio Code, terminal).

## Installation

1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/Sherli7/venteservice.git
   cd venteservice
   ```

2. **Installez les dépendances** :
   Assurez-vous que Node.js est installé, puis exécutez :
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement** :
   - Créez un fichier `.env` à la racine du projet (basé sur l'exemple `.env.example` si fourni, sinon voir ci-dessous).
   - Exemple de contenu pour `.env` :
     ```
     PORT=3000
     ```
   - **Important** : Ajoutez `.env` à `.gitignore` pour éviter de pousser des données sensibles.

4. **Lancez l'application** :
   ```bash
   node server.js
   ```
   Par défaut, l'application sera accessible à `http://localhost:3000`.

## Structure du projet
```
venteservice/
├── public/           # Fichiers statiques du frontend
│   ├── index.html    # Page principale
│   ├── style.css     # Styles personnalisés
│   ├── progress.js   # Gestion de la barre de progression
│   ├── script.js     # Logique JavaScript
│   └── images/       # Images (ex. : logoOBIV.jpeg)
├── routes/           # Définition des routes API
├── .env             # Variables d'environnement
├── README.md        # Documentation
├── package.json     # Configuration Node.js
├── server.js        # Point d'entrée du serveur
└── services.json    # Données statiques des services
```

## Utilisation
1. Accédez à l'application via votre navigateur à l'adresse affichée (ex. : `http://localhost:3000`).
2. Sélectionnez un ou plusieurs services et leurs modules dans l'interface.
3. Remplissez le formulaire avec vos informations personnelles.
4. Soumettez votre demande (la gestion des données soumises est à implémenter).

## Développement
### Ajout de fonctionnalités
- Implémentez une base de données (ex. : MongoDB) pour stocker les données des utilisateurs au lieu de `services.json`.
- Ajoutez une validation côté serveur dans `server.js`.
- Développez des tests unitaires (ex. : avec Jest) et des tests d'intégration.

### Contribution
1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité : `git checkout -b feature/nouvelle-fonctionnalite`.
3. Faites vos modifications et committez : `git commit -m "Description de la modification"`.
4. Poussez vers votre fork : `git push origin feature/nouvelle-fonctionnalite`.
5. Créez une pull request sur ce dépôt.

## Problèmes connus
- Les données soumises via le formulaire ne sont pas encore traitées (à implémenter).
- Le fichier `.env` est actuellement dans le dépôt public ; il doit être exclu avec `.gitignore`.
- Absence de tests automatisés.

## Licence
[À définir] - Par défaut, aucun licence n'est spécifiée. Ajoutez une licence (ex. : MIT) si vous souhaitez autoriser la réutilisation.

## Contact
- **Auteur** : Sherli7
- **GitHub** : [https://github.com/Sherli7](https://github.com/Sherli7)
- Pour toute question ou suggestion, ouvrez une issue dans ce dépôt.

---

### Notes
- **Personnalisation** : Vous pouvez ajuster les sections (ex. : ajouter des détails sur les technologies utilisées comme Express ou MDL) ou modifier le ton selon vos préférences.
- **Fichier `.env.example`** : Si vous voulez fournir un modèle pour `.env`, créez un fichier `.env.example` avec les variables nécessaires (ex. : `PORT=3000`) et mentionnez-le dans les instructions.
- **Implémentation** : Si `server.js` ou `script.js` contiennent déjà des fonctionnalités spécifiques (ex. : API ou soumission de formulaire), mettez à jour la section "Utilisation" en conséquence.

Voulez-vous que je modifie ou ajoute quelque chose à ce `README.md` ? Par exemple, je peux inclure des exemples de code ou des instructions plus détaillées si vous me fournissez plus de détails sur `server.js` ou `script.js`.