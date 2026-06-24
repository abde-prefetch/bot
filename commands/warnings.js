const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { warnings } = require('./warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Voir les avertissements d\'un membre')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Membre à consulter').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });

    const guildId = interaction.guild.id;
    const userId = target.user.id;
    const userWarns = (warnings[guildId]?.[userId]) ?? [];

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Avertissements de ${target.user.tag}`)
      .setColor(userWarns.length === 0 ? 0x00ff00 : 0xff9900)
      .setThumbnail(target.user.displayAvatarURL());

    if (userWarns.length === 0) {
      embed.setDescription('Aucun avertissement.');
    } else {
      userWarns.forEach((w, i) => {
        embed.addFields({
          name: `#${i + 1} — ${w.date}`,
          value: `📋 ${w.raison}\n👮 Par <@${w.modId}>`,
        });
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
