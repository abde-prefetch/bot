const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Retirer le mute (timeout) d\'un membre')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Membre à unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');

    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!target.isCommunicationDisabled()) return interaction.reply({ content: '⚠️ Ce membre n\'est pas mute.', ephemeral: true });

    await target.timeout(null);
    await interaction.reply(`🔊 **${target.user.tag}** a été unmute.`);
  },
};
