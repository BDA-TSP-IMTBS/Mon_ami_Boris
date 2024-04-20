const { Events } = require('discord.js');

const { reactionToRole } = require('./config/configReactionToRole.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		for (messageToReact of reactionToRole) {
			const channel = client.channels.cache.get(messageToReact.channelId);
			try {
				await channel.messages.fetch(messageToReact.messageId);
				console.log(`Le message ${messageToReact.messageName} a été récupéré.`);
				} catch (error) {
				console.error('Erreur lors de la récupération du message :', error);
			}
		}
		console.log(`Bot ${client.user.tag} opérationnel`);
	},
};