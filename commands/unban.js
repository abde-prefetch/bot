const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Débannir un utilisateur par son ID')
    .addStringOption(opt =>
      opt.setName('userid').setDescription('ID de l\'utilisateur').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');

    try {
      const user = await interaction.guild.members.unban(userId);
      await interaction.reply(`✅ **${user.tag}** a été débanni.`);
    } catch {
      await interaction.reply({ content: '❌ Impossible de débannir : ID invalide ou utilisateur non banni.', ephemeral: true });
    }
  },
};
