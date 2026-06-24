const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre du serveur')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Membre à expulser').setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison du kick').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') ?? 'Aucune raison fournie';

    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: '❌ Je ne peux pas expulser ce membre.', ephemeral: true });

    await target.kick(raison);
    await interaction.reply(`👢 **${target.user.tag}** a été expulsé.\n📋 Raison : ${raison}`);
  },
};
