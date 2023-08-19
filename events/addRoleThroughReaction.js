const { Events } = require('discord.js');

// On récupère une liste indiquant quels message peuvent permettre de donner un rôle et quels emojis donnent quels rôles. 

// La liste se présente sous une forme de liste de message: [message_1, message_2, ...]
// Ensuite, chaque message est un objet au format json, qui possède 2 attributs:
//                  - messageId : l'id du message qui nous interresse
//                  - messageName: nom du message, pour pouvoir l'identifier facilement
//                  - emojiToRole : une liste de json qui informe de comment se comporter quand telle ou telle emoji est donné

// Les éléments qui composent emojiToRole sont des jsons composés de 2 attributs (emoji, role), qui indiquent que si telle emoji est donnée, alors tel rôle doit être attribué
const { reactionToRole } = require('./configReactionToRole.json');


module.exports = {
	name: Events.MessageReactionAdd,
	once: false,
	async execute(reaction, user) {
        // Quand une réation est reçue, on regarde si la structure est partielle, si oui on attend que toutes les informations soient dans  la mémoire locale du bot
        if (reaction.partial) {
            // Si le message auquel la réaction appartient a été supprimé, le fetch pourrait amener à une erreur de l'API qui doit être prise en compte
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        // On compare avec chaque message présent dans reactionToRole pour savoir si il s'agit d'un message nous interressant
        for (messsageToReact of reactionToRole) {
            if (reaction.message.id === messsageToReact.messageId) {

                // On compare avec toutes les emojis de réaction possible à ce message pour savor quel rôle donner
                for (emojiToReact of messsageToReact.emojiToRole) {
                    if (reaction.emoji.name === emojiToReact.emoji) {

                        // On récupère l'utilisateur
                        const guild = reaction.message.guild;
                        const member = await guild.members.fetch(user.id);

                        // Si l'utilisateur existe bien
                        if (member) {
                            // On récupère le rôle à ajouter
                            const roleToAdd = guild.roles.cache.find(role => role.name === emojiToReact.role);

                            if (roleToAdd) {
                                // Si il existe un rôle général et si l'utilisateur ne l'a pas déjà
                                if (messsageToReact.generalRole !== "" && !(member.roles.cache.some(role => role.name === messsageToReact.generalRole))) {
                                    const generalRoleToAdd = guild.roles.cache.find(role => role.name === messsageToReact.generalRole);
                                    if (generalRoleToAdd) {
                                        try {
                                            // On lui rajoute
                                            await member.roles.add(generalRoleToAdd);
                                            console.log(`Le rôle ${generalRoleToAdd.name} a été attribué à ${user.username}.`);
                                            } catch (error) {
                                            console.error('Erreur lors de l\'attribution du rôle :', error);
                                        }
                                    }
                                }

                                // On ajoute le rôle demandé à l'utilisateur
                                try {
                                    await member.roles.add(roleToAdd);
                                    console.log(`Le rôle ${roleToAdd.name} a été attribué à ${user.username}.`);
                                    } catch (error) {
                                    console.error('Erreur lors de l\'attribution du rôle :', error);
                                }
                            }
                            else {console.log(`Rôle ${messsageToReact.generalRole} non trouvé`)}
                        }
                        else {console.log(`Utilisateur ${user.username} non trouvé`)}
                    }
                }
            }
        }
    },
};