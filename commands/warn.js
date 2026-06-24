const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// Stockage en mémoire : { guildId: { userId: [ { raison, date, modId } ] } }
const warnings = {};

function getWarnings(guildId, userId) {
  if (!warnings[guildId]) warnings[guildId] = {};
  if (!warnings[guildId][userId]) warnings[guildId][userId] = [];
  return warnings[guildId][userId];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un membre')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Membre à avertir').setRequired(true))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison');

    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });

    const userWarns = getWarnings(interaction.guild.id, target.user.id);
    userWarns.push({ raison, date: new Date().toLocaleString('fr-FR'), modId: interaction.user.id });

    await interaction.reply(
      `⚠️ **${target.user.tag}** a reçu un avertissement. (Total : **${userWarns.length}**)\n📋 Raison : ${raison}`
    );
  },

  warnings, // Export pour la commande /warnings
};
