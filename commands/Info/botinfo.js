const Command = require('../../Base/Command.js');
const { MessageEmbed, version } = require('discord.js');
const os = require('os');

class BotInfo extends Command {

    constructor(client) {
        super(client);

        this.config({
            name: 'botinfo',
            aliases: ['bi'],
            description: 'Bot information',
        });
    }

    async run(message) {
        const admins = this.client.config.OWNER;
        const SystemString = `= System Info =
• Total Commands :: ${this.client.commands.size.toLocaleString()}
• Memory Usage   :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Bot Uptime     :: ${this.client.utils.formatDuration(this.client.uptime)}
• Users          :: ${this.client.users.cache.size.toLocaleString()}
• Servers        :: ${this.client.guilds.cache.size.toLocaleString()}
• Channels       :: ${this.client.channels.cache.size.toLocaleString()}
• Discord.js     :: v${version}
• Node           :: ${process.version}
• CPU            :: ${os.cpus()[0].model} (x${os.cpus().length})
• Memory         :: ${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB
• OS             :: ${this.client.utils.properCase(os.platform() === 'win32' ? 'windows' : os.platform())}`;

        const embed = new MessageEmbed()
            .setAuthor({ name: 'Bot Information', iconURL: message.guild.iconURL() })
            .setThumbnail(this.client.user.displayAvatarURL({ size: 4096 }))
            .setDescription(`${this.client.user.username} is an open-source multipurpose discord bot developed by **[21Z](https://github.com/21Z)**.`)
            .setColor('RANDOM')
            .addFields(
                { name: 'Name', value: this.client.user.username, inline: true },
                { name: 'Discriminator', value: this.client.user.discriminator, inline: true },
                { name: 'Type', value: this.client.user.bot ? 'Bot' : 'User', inline: true },
                { name: 'ID', value: this.client.user.id, inline: true },
                { name: 'Owners', value: `${admins.map(m => `<@!${m}>`).join(', ')}`, inline: true },
                { name: 'Created At', value: this.client.user.createdAt.toString() },
                { name: '\u200b', value: `\`\`\`asciidoc\n${SystemString}\`\`\`` },
                { name: 'GitHub (Source Code)', value: '**[Click Here](https://github.com/erbiumbot/Erbium)**' },
            )
            .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
}

module.exports = BotInfo;