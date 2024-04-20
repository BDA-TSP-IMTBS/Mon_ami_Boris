const { Events, WebhookClient, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

// URL du Webhook
const { webhookURL } = require('../config.json');
const webhookClient = new WebhookClient({ url: webhookURL });

const { receptionChannel } = require('./config/configTransfertSubscriptions.json');
const { serverBots } = require('./config/configTransfertSubscriptions.json');
const { rolesEquivalents } = require('./config/configTransfertSubscriptions.json');

function addRolePing(messageContent, serverRole) {
    // Retouche le message pour inclure les pings des rôles concernés
    let i = 0;
    while (i < messageContent.length) {
        // Si on détecte un @ dans le message
        if (messageContent[i] == "@") {                             
            
            // On verifie tous les rôles possibles des serveurs auquels nous sommes aboné
            for (rolesEquivalent of rolesEquivalents) {
                for (equivalent of rolesEquivalent.equivalences) {

                    if (messageContent.substr(i+1, equivalent.length) == equivalent) {
                        // Si il s'agit bien d'un rôle d'un autre serveur, on remplace par l'équivalent sur notre serveur
                        messageContent = messageContent.replace(messageContent.substr(i, equivalent.length+1), rolesEquivalent.serverRole)
                        i += equivalent.length;
                        break
                    }
                }
            }
        }
        i ++;
    }
    
    // On rajoute le rôle qui correspond au server abonné
    return serverRole + "\n" + messageContent;
}

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message, client) {
        // Si c'est un autre utilisateur que le bot
        if (message.author.id != client.user.id) {

            // Si c'est un autre utilisateur que le webhook
            if (message.author.id != webhookClient.id) {

                // On vérifie que le message vient bien du channel voulu
                if (message.channel.id == receptionChannel) {
                    console.log("Message arrived");
                    
                    // On regarde que ce soit bien un serveur enregistré par le bot
                    let found = false;
                    let serverInformations;

                    for (serverBot of serverBots) {
                        if (serverBot.id == message.author.id) {
                            serverInformations = serverBot;
                            found = true
                            break
                        }
                    }

                    if (found === true) {                        
                        // Personnalise l'apparence du Webhook pour qu'il prenne celle du server qui publie
                        await webhookClient.edit({
                            name: serverInformations.name,
                            avatar: serverInformations.avatar,
                        })

                        let messageContent = "";              
                        if (message.content != "") {
                            //  Ping des rôles
                            messageContent = addRolePing(message.content, serverInformations.roleToPing);
                        }
                        
                        // ======================================== Pièces jointes ======================================== 
                        // Initialisation du stockage des pièces jointes
                        const attachments = [];

                        // On vérifie que le message contienne des pièces jointes
                        if (message.attachments.size > 0) {
                            message.attachments.forEach(attachment => {
                                const attachmentFile = new AttachmentBuilder(attachment.url);
                                // Ajoute le fichier à la liste
                                attachments.push(attachmentFile);
                            });
                        }
                        
                        // Et on envoie
                        webhookClient.send({
                            content: messageContent,
                            files: attachments
                        })
                        .then(sentMessage => {  // On rajoute le message dans la "base de donnée"
                                                const mapping = `${message.id}:${sentMessage.id}:${serverInformations.roleToPing}\n`;

                                                // Append the mapping to the text file
                                                fs.appendFileSync('message_mapping.txt', mapping);
                                                console.log('Message sent successfully!')
                        })         
                        .catch(console.error);
                    }
                    else {
                        console.log("Server Bot haven't been found")
                    }
                }
            }
        }
    },
};