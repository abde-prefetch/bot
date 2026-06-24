const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Voir la latence du bot'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Calcul en cours...', fetchReply: true });
    const latence = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatence = interaction.client.ws.ping;
    await interaction.editReply(`🏓 **Pong !**\n⚡ Latence : **${latence}ms**\n💓 WebSocket : **${wsLatence}ms**`);
  },
};
