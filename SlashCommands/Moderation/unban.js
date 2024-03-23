const Command = require("../../Base/Command.js");
const { ApplicationCommandOptionType } = require("discord.js");
const createEmbed = require("../../utils/createEmbed.js");

class UnBan extends Command {

    constructor(client) {
        super(client);

        this.config({
            name: "unban",
            description: "Unban a user from the server!",
            botPerms: ["BanMembers"],
            permissions: ["BanMembers"],
            options: [
                {
                    name: "user",
                    description: "The user to ban",
                    required: true,
                    type: ApplicationCommandOptionType.User,
                },
                {
                    name: "reason",
                    description: "The reason for banning the user",
                    type: ApplicationCommandOptionType.String,
                },
            ],
        });
    }

    async run(interaction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        const intialreason = interaction.options.getString("reason");
        const moderator = `by ${interaction.member.tag} [ID: ${interaction.member.id}]`;
        const reason = intialreason ? intialreason + ", " + moderator : "Unbanned " + moderator;
        const embedreason = intialreason || "None";
        if (!target) return interaction.reply({ embeds: [createEmbed("warn", "Please specify a valid user who you want to unban!")] });

        // If the user is not banned
        const bans = await interaction.guild.bans.fetch();
        if (!bans.some((m) => m.user.id === target.id)) return interaction.reply({ embeds: [createEmbed("error", "The user you specified is not banned!", true)] });

        const embed = createEmbed("success")
            .setTitle("Action: Unban")
            .setDescription(`Unbanned ${target} (\`${target.tag}\`)\nReason: ${embedreason}`)
            .setThumbnail(target.displayAvatarURL())
            .setFooter({
                text: `Unbanned by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            });

        await interaction.guild.bans.remove(target.id, reason).then(() => {
            interaction.editReply({ embeds: [embed] });
        });
    }

}

module.exports = UnBan;
