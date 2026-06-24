const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre du serveur')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison du ban').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') ?? 'Aucune raison fournie';

    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!target.bannable) return interaction.reply({ content: '❌ Je ne peux pas bannir ce membre.', ephemeral: true });

    await target.ban({ reason: raison });
    await interaction.reply(`🔨 **${target.user.tag}** a été banni.\n📋 Raison : ${raison}`);
  },
};
