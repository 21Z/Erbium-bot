const Command = require("../../Base/Command.js");
const { Canvas: Canvacord } = require("canvacord");
const { AttachmentBuilder } = require("discord.js");
const createEmbed = require("../../utils/createEmbed.js");

class Spank extends Command {

    constructor(client) {
        super(client);

        this.config({
            name: "spank",
            description: "Spank someone",
            botPerms: ["EmbedLinks"],
        });
    }

    async run(message, args) {
        const user = message.mentions.users.first() || await this.client.resolveUser(args.join(" ")) || message.author;
        if (user === message.author) return message.reply({ embeds: [createEmbed("error", "Tag someone!", true)] });

        const m = await message.reply("⏱ | Please wait...");
        const img = await Canvacord.spank(message.author.displayAvatarURL({ extension: "png", size: 2048 }), user.displayAvatarURL({ extension: "png", size: 2048 }));
        const attachment = new AttachmentBuilder(img, { name: "blur.png" });
        await m.delete().catch(() => {});

        return message.reply({ embeds: [createEmbed("info").setImage("attachment://spank.png")], files: [attachment] });
    }

}

module.exports = Spank;
