/* eslint-disable no-unused-vars */
const Command = require('../../Base/Command');
const { EmbedBuilder } = require('discord.js');
const { inspect } = require('util');

class Eval extends Command {

    constructor(client) {
        super(client);

        this.config({
            name: 'eval',
            aliases: ['evaluate', 'ev', 'exec'],
            description: 'Evaluates Arbitrary JavaScript Code',
            ownerOnly: true,
        });
    }

    async run(message, args) {
        const embedColor = this.client.config.EMBED_COLOR;
        const Discord = require('discord.js');
        const client = this.client;
        const msg = message;

        const code = args
            .join(' ')
            .replace(/^\s*\n?(```(?:[^\s]+\n)?(.*?)```|.*)$/s, (_, a, b) => a.startsWith('```') ? b : a);
        const embed = new EmbedBuilder().setColor(embedColor).addFields([{ name: 'Input', value: code.length > 1024 ? `${await this.client.utils.hastebin(code)}.js` : `\`\`\`js\n${code}\n\`\`\`` }]);

        try {
            if (!code) {
                return await message.channel.send({
                    embeds: [new EmbedBuilder().setColor(embedColor).setDescription('❌ **|** No code was provided.')],
                });
            }
            const isAsync = /.* --async( +)?(--silent)?$/.test(code);
            const isSilent = /.* --silent( +)?(--async)?$/.test(code);
            const toExecute =
            isAsync || isSilent ? code.replace(/--(async|silent)( +)?(--(silent|async))?$/, '') : code;
            const evaled = inspect(await eval(isAsync ? `(async () => {\n${toExecute}\n})()` : toExecute), {
                depth: 0,
            });

            if (isSilent) return;

            const cleaned = this.client.utils.cleanText(evaled);
            const output = cleaned.length > 1024 ? `${await this.client.utils.hastebin(cleaned)}.js` : `\`\`\`js\n${cleaned}\n\`\`\``;
            embed.addFields([{ name: 'Output', value: output }]);
            message.channel.send({
                askDeletion: {
                    reference: message.author.id,
                },
                embeds: [embed],
            }).catch(e => console.error('PROMISE_ERR:', e));
        }
        catch (e) {
            const cleaned = this.client.utils.cleanText(String(e));
            const error = `\`\`\`js\n${cleaned}\n\`\`\``;
            if (error.length > 1024) {
                const hastebin = await client.util.hastebin(error);
                embed.setColor('Red').addFields({ name: 'Error', value: `${hastebin}.js` });
            }
            else { embed.setColor('Red').addFields({ name: 'Error', value: error }); }
            message.channel.send({ embeds: [embed] }).catch(err => console.error('PROMISE_ERR:', err));
        }
    }
}

module.exports = Eval;
