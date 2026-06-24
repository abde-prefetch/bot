const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Voir les infos d\'un membre')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Membre à inspecter').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember('membre') ?? interaction.member;
    const user = target.user;

    const roles = target.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => `<@&${r.id}>`)
      .slice(0, 10)
      .join(', ') || 'Aucun';

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .setColor(target.displayHexColor || 0x5865f2)
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📛 Pseudo serveur', value: target.displayName, inline: true },
        { name: '📅 Compte créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '📥 A rejoint le', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: '🤖 Bot ?', value: user.bot ? 'Oui' : 'Non', inline: true },
        { name: `🎭 Rôles (${target.roles.cache.size - 1})`, value: roles },
      )
      .setFooter({ text: `Demandé par ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
