const { SlashCommandBuilder } = require('discord.js');

const STAFF_ROLES = ['1518233336638603408', '1518232447500816487'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('closeticket')
    .setDescription('Fermer et supprimer ce ticket'),

  async execute(interaction) {
    const channel = interaction.channel;
    const member = interaction.member;

    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ Cette commande ne peut être utilisée que dans un ticket.', ephemeral: true });
    }

    const isStaff = STAFF_ROLES.some(id => member.roles.cache.has(id));
    const isOwner = channel.name.includes(interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, ''));

    if (!isStaff && !isOwner) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission de fermer ce ticket.', ephemeral: true });
    }

    await interaction.reply({ content: '🔒 Fermeture du ticket dans 5 secondes...' });
    setTimeout(() => channel.delete().catch(() => {}), 5000);
  }
};
