# Mon Ami Boris

Mon Ami Boris est un bot Discord permettant aux membres d'un serveur de s'auto-attribuer des rôles en réagissant à des messages. Elle a été créée en 2023 par le pôle web du BDA du campus TSP/IMTBS.

## Installation

Pour déployer le bot, vous avez pouvez le faire dans une machine virtuelle (VM)

### Déploiement dans une VM

Il vous faut installer `Node Vercion Manager (NVM)` dans votre VM. NVM est un outils qui permet de gérer plusieurs versions de Node.js. Vous pouvez utiliser les commandes suivantes pour le faire ou suivre d'autres méthodes.

```bash
 sudo apt install curl
 curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Fermez et ouvrez ensuite votre terminal ou exécutez la commande suivante pour que les modifications prennent effet :

```bash
 source ~/.bashrc
```

Ensuite, il vous faut installer une nouvelle version de Node.js. Vous pouvez lister les versions disponibles de Node.js en exécutant :

```bash
 nvm list-remote
```

Choisissez une version plus récente et installez-la. Par exemple :

```bash
 nvm install 14.17.6
```
Remplacez 14.17.6 par la version que vous souhaitez installer.

Une fois la nouvelle version de Node.js installée, vous pouvez l'utiliser en l'activant :

```bash
 nvm use 14.17.6
```

Vous pouvez également la définir comme version par défaut :

```bash
 nvm alias default 14.17.6
```

Installer les bibliothèques :

```bash
 npm install discord.js
```

Ensuite, clonez le repository où vous le souhaitez dans la machine.



## Utiliser le bot

### Étape 1 : Configurer le token du bot

Dans la racine du projet, ajouter un fichier "config.json" de la forme:

```json
{
  {
  "token": "your-token"
  }
}
```
Le token du bot étant comme son mot de passe, il ne peut pas être mis sur le GitHub


### Étape 2 : Customiser les rôles et réactions

Les associations rôles/messages/réactions sont à controler dans le fichier `./events/configReactionToRole.json`

```json
{
  "reactionToRole" : [
    {            
      "messageName": "Charte du Discord",
      "messageId": "1142084103366258819",
      "channelId": "1140272138763386990",
      "emojiToRole": [
        { "emoji": "✅", "role": "Public" }
      ],
      "generalRole": ""
    },
    {
      "messageName": "Rôle du BDA",
      "messageId": "1142085746887491634",
      "channelId": "1140272819813482636",
      "emojiToRole": [
        { "emoji": "🪩", "role": "Soirées" },
        { "emoji": "🧑‍🎤", "role": "Scènes ouvertes" },
        { "emoji": "🪅", "role": "Festiv'ART" },
        { "emoji": "🖼️", "role": "Sorties RA" },
        { "emoji": "🖌️", "role": "Lumin&Sens" },
        { "emoji": "❄️", "role": "Marché de Noël" },
        { "emoji": "🤝", "role": "Intronisation" }
      ],
      "generalRole": "●▬▬●Évènements du BDA●▬▬●"
    },
  ]
}
```

- `messageName` : Nom du message
- `messageId` : id du message dans discord
- `channelId` : id du channel dans lequel est le message
- `emojiToRole` : tableau faisant le lien entre la réation et le rôle à ajouter/retirer
  ```json
      ...
      { "emoji": "🪩", "role": "Soirées" },
      ...
  ```
- `generalRole`: Catégorie de rôle auquels appartiennent les rôles à ajouter sur le message. Il s'agit juste d'un rôle plus long n'apportant aucun privilège, mais permettant une meilleur lecture des rôles d'une personne