const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprimer des messages dans le salon')
    .addIntegerOption(opt =>
      opt.setName('nombre')
        .setDescription('Nombre de messages à supprimer (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const nombre = interaction.options.getInteger('nombre');

    await interaction.deferReply({ ephemeral: true });
    const deleted = await interaction.channel.bulkDelete(nombre, true);
    await interaction.editReply(`🗑️ **${deleted.size}** message(s) supprimé(s).`);
  },
};
