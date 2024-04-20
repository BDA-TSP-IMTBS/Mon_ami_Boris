const { Events, WebhookClient, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

// URL du Webhook
const { webhookURL } = require('../config.json');
const webhookClient = new WebhookClient({ url: webhookURL });

const { receptionChannel } = require('./config/configTransfertSubscriptions.json');
const { serverBots } = require('./config/configTransfertSubscriptions.json');
const { rolesEquivalents } = require('./config/configTransfertSubscriptions.json');

function getWebhookMessageId(originalMessageId) {
    // Lit le conenu du fichier
    const fileContent = fs.readFileSync('message_mapping.txt', 'utf8');

    // Sépare le contenu en lignes
    const lines = fileContent.split('\n');

    // Trouve la ligne avec l'id du message original
    for (let i = 0; i < lines.length; i++) {
        const [savedOriginalMessageId, webhookMessageId, serverRole] = lines[i].split(':');

        if (savedOriginalMessageId === originalMessageId) {
            return webhookMessageId + ":" + serverRole;
        }
    }

    return null; // Return null if mapping not found
}

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
	name: Events.MessageUpdate,
	once: false,
	async execute(oldMessage, newMessage, client) {

        // Si c'est un autre utilisateur que le bot
        if (newMessage.author.id != client.user.id) {

            // Si c'est un autre utilisateur que le webhook
            if (newMessage.author.id != webhookClient.id) {

                // On vérifie que le message vient bien du channel voulu
                if (newMessage.channel.id == receptionChannel) {

                    console.log("Message Update");
                    const tmp = getWebhookMessageId(newMessage.id)
                    const [webhookMessageId, serverRole] = tmp.split(':');

                    if (webhookMessageId != null) {
                        if (newMessage.content == "[Original Message Deleted]" || newMessage.content == "[Message d'origine supprimé]") {
                            webhookClient.deleteMessage(webhookMessageId)
                            .then(() => { console.log('Message deleted successfully!'); })
                            .catch(console.error);
                        }
                        else {
                            const messageContent = addRolePing(newMessage.content, serverRole);

                            // Update the message content using the editMessage method
                            webhookClient.editMessage(webhookMessageId, {
                                content: messageContent
                            })
                            .then(() => {console.log('Message updated successfully!');})
                            .catch(console.error);
                        }
                    }
                }
            }
        }
    },
};

