const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const DUREES = {
  '60s': 60 * 1000,
  '5min': 5 * 60 * 1000,
  '10min': 10 * 60 * 1000,
  '30min': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7j': 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mettre un membre en sourdine (timeout)')
    .addUserOption(opt =>
      opt.setName('membre').setDescription('Membre à mute').setRequired(true))
    .addStringOption(opt =>
      opt.setName('duree')
        .setDescription('Durée du mute')
        .setRequired(true)
        .addChoices(
          { name: '1 minute', value: '60s' },
          { name: '5 minutes', value: '5min' },
          { name: '10 minutes', value: '10min' },
          { name: '30 minutes', value: '30min' },
          { name: '1 heure', value: '1h' },
          { name: '6 heures', value: '6h' },
          { name: '12 heures', value: '12h' },
          { name: '24 heures', value: '24h' },
          { name: '7 jours', value: '7j' },
        ))
    .addStringOption(opt =>
      opt.setName('raison').setDescription('Raison du mute').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    const dureeKey = interaction.options.getString('duree');
    const raison = interaction.options.getString('raison') ?? 'Aucune raison fournie';
    const dureeMs = DUREES[dureeKey];

    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: '❌ Je ne peux pas mute ce membre.', ephemeral: true });

    await target.timeout(dureeMs, raison);
    await interaction.reply(`🔇 **${target.user.tag}** a été mute pendant **${dureeKey}**.\n📋 Raison : ${raison}`);
  },
};
