# Mon Ami Boris

Mon Ami Boris est un bot Discord permettant diverses choses pour la gestion d'un serveur Discord :
- L'attribution de rôles par les membres via des réactions à certains messages;
- Le rajout des notifications sur le système d'abonnement aux serveurs communautaires.

 Il a été créée en 2023 par le pôle web du BDA du campus TSP/IMTBS.

<br />

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

Choisissez la version 16.11.0 installez-la :

```bash
 nvm install 16.11.0
 nvm use 16.11.0 # Activer l'utilisation de la version
 nvm alias default 16.11.0 # La définir comme version par défaut
```

Installer les bibliothèques :

```bash
 npm install discord.js
```

Ensuite, clonez le repository où vous le souhaitez dans la machine.

<br />

### Relancer le bot

Pour relancer le bot lorsque la VM est redémarée, il existe plusieurs méthodes. Ici, je vais détailler celle utilisant le gestionnaire de processus pm2.

D'abord, installer pm2 :
```bash
 npm install pm2@latest -g
```

Pour lancer l'application, utilisez :
```bash
 pm2 start ./Mon_ami_Boris/index.js --name "Mon ami Boris" # --name "Mon ami Boris" est optionnel, mais est plus pratique pour suivre le processus
```

Puis pour mettre en place le redémarrage du bot:
```bash
 pm2 startup
 # Il est demandé de renter une commande donnée et après :
 pm2 save
```

<br />

### Ajouter le fichier config

Dans la racine du projet, ajouter un fichier "config.json" de la forme:

```json
{
    "token": "your-token",
    "webhookURL": "your-webhook-url"
}
```
Le token du bot étant comme son mot de passe, il ne peut pas être mis sur le GitHub. De même pour l'url du webhook, si l'on ne veut pas que quelqu'un se mette à envoyer des messages dans le channel du webhook.

<br /><br />

# Utiliser le bot

### Utilisation 1 : Donner des rôles via des réactions aux messages

Les associations rôles/messages/réactions sont à controler dans le fichier [configReactionToRole.json](./events/config/configReactionToRole.json)

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

<br />

### Utilisation 2 : Abonnement aux serveurs communautaires

Le bot permet un abonnement aux serveurs commnunautaires, en retransmettant les pings fait sur ces serveurs et qui ne sont pas retransmis normalement.

Tout d'abord, il faut metre dans le fichier `config.json` l'url du webhook qui doit retransmettre les messages.

Son fonctionement est parametré par le fichier [configTransfertSubscriptions.json](./events/config/configTransfertSubscriptions.json) :

```json
{
    "receptionChannel": 1231192679899987968,    
    "serverBots": [
        {
            "id": 1231198429103919205,
            "name": "Anim'INT",
            "avatar": "https://raw.githubusercontent.com/BDA-TSP-IMTBS/Mon_ami_Boris/master/resources/serverAvatar/Anim'INT.png",
            "roleToPing": "<@&1134134908185497640>"
        }
    ],
    "rolesEquivalents": [
        { 
            "serverRole": "<@&1134131858062458951>",
            "equivalences": ["1A", "Ecuyer·e (1A)", "Segment", "Petit pain (1A)", "Petit moineau", "street magicien (1A)", "Thé Vert", "El Pueblo"]
        }
    ]
}
```

- `receptionChannel` : Id du channel abonné aux serveurs communautaire;
- `serverBots` : Liste des serveurs communautaires auquels les serveur est abonné;
  ```json
      ...
      {
            "id": 1231198429103919205,
            "name": "Anim'INT",
            "avatar": "https://raw.githubusercontent.com/BDA-TSP-IMTBS/Mon_ami_Boris/master/resources/serverAvatar/Anim'INT.png",
            "roleToPing": "<@&1134134908185497640>"
      }
      ...
  ```
- `id`: Id du bot qui retransmet les messages du serveur communautaire;
- `name`: Nom à donner au webhook pour retransmettre le message;
- `avatar`: Avatar à donner au webhook pour retransmettre le message. Les images sont stockées dans le dossier [resources](./resources/). ATTENTION : il faut bien mettre le lien  INTERNET vers l'image;
- `roleToPing`: Id du rôle à ping quand un message provient de ce serveur communautraire. Pour le récupérer, faites `\@role` sur votre serveur;


- `rolesEquivalents`: Liste des rôles pouvant être ping dans les messages.
  ```json
      ...
      { 
            "serverRole": "<@&1134131858062458951>",
            "equivalences": ["1A", "Ecuyer·e (1A)", "Segment", "Petit pain (1A)", "Petit moineau", "street magicien (1A)", "Thé Vert", "El Pueblo"]
      }
      ...
  ```
- `serverRole`: Id du rôle équivalent sur le serveur;
- `equivalences`: Liste des noms des rôles des serveurs communautaires qui équivalent au rôle du serveur. L'exemple montre les équivalent du rôle `première année` sur les différents serveurs des clubs du BDA.