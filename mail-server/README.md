# Mail Server

[![build status](https://gitlab.app.synaltic.eu/common/dev/mail-server/badges/recette/build.svg)](https://gitlab.app.synaltic.eu/common/dev/mail-server/commits/recette)


## Motivation
Service d'envoi de mail générique.

## Prérequis
Vous devez installer docker et docker-compose sur votre machine.

## Lancer
Installer les dépendances
```
yarn
```
Lancer le docker-compose
```
docker-compose up
```

## Exécuter les tests
```
docker-compose -f docker-compose.test.yml up
```

## Contribuer
TODO

## Versioning
Nous utilisons [SemVer](http://semver.org/) pour la gestion des versions. Pour les versions disponibles, voir les balises sur ce repository.

## Auteurs

* **Guillaume WEILL** - *Initial work*
* **Fabien OGER** - *Initial work*
