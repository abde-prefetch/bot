const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const STAFF_ROLES = ['1518233336638603408', '1518232447500816487'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Configurer le panel de tickets (Admin)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎫 Support')
      .setDescription('Clique sur le bouton ci-dessous pour ouvrir un ticket.')
      .setColor(0x5865F2);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('📩 Ouvrir un ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Panel de ticket configuré avec succès !', ephemeral: true });
  },

  // Gérer les boutons (ouverture et fermeture)
  async handleButton(interaction) {
    if (interaction.customId === 'open_ticket') {
      const guild = interaction.guild;
      const user = interaction.user;

      // Vérifier si l'utilisateur a déjà un ticket ouvert
      const existing = guild.channels.cache.find(
        c => c.name === `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}` && c.type === ChannelType.GuildText
      );
      if (existing) {
        return interaction.reply({ content: `❌ Tu as déjà un ticket ouvert : ${existing}`, ephemeral: true });
      }

      // Créer les permissions
      const permissionOverwrites = [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        },
      ];

      // Ajouter les rôles staff
      for (const roleId of STAFF_ROLES) {
        const role = guild.roles.cache.get(roleId);
        if (role) {
          permissionOverwrites.push({
            id: roleId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels],
          });
        }
      }

      // Créer le salon
      const channel = await guild.channels.create({
        name: `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        type: ChannelType.GuildText,
        permissionOverwrites,
      });

      // Embed de bienvenue
      const embed = new EmbedBuilder()
        .setTitle('🎫 Ticket ouvert')
        .setDescription(`Bonjour ${user}, un membre du staff va te répondre rapidement.\nExplique ton problème en détail.`)
        .setColor(0x5865F2)
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('🔒 Fermer le ticket')
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({ embeds: [embed], components: [row] });

      await interaction.reply({ content: `✅ Ton ticket a été créé : ${channel}`, ephemeral: true });

    } else if (interaction.customId === 'close_ticket') {
      const member = interaction.member;
      const isStaff = STAFF_ROLES.some(id => member.roles.cache.has(id));
      const channel = interaction.channel;

      // Vérifier si c'est le propriétaire du ticket ou un staff
      const isOwner = channel.name.includes(interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, ''));

      if (!isStaff && !isOwner) {
        return interaction.reply({ content: '❌ Tu n\'as pas la permission de fermer ce ticket.', ephemeral: true });
      }

      await interaction.reply({ content: '🔒 Fermeture du ticket dans 5 secondes...' });
      setTimeout(() => channel.delete().catch(() => {}), 5000);
    }
  }
};
