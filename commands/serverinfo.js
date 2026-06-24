const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Voir les infos du serveur'),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.members.fetch();

    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const humains = guild.memberCount - bots;

    const embed = new EmbedBuilder()
      .setTitle(`🏰 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .setColor(0x5865f2)
      .addFields(
        { name: '🆔 ID', value: guild.id, inline: true },
        { name: '👑 Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👥 Membres', value: `${humains} humains · ${bots} bots`, inline: true },
        { name: '💬 Salons', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Rôles', value: `${guild.roles.cache.size}`, inline: true },
        { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
        { name: '🔒 Vérification', value: guild.verificationLevel.toString(), inline: true },
      )
      .setFooter({ text: `Demandé par ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
