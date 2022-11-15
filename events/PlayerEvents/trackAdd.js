import Event from "../../Base/Event.js";

class TrackAdd extends Event {

    constructor(client) {
        super(client);
    }

    run(message, queue, track) {
        void message.reply(`✅ | Track **${track.title}** by **${track.author ?? "Unknown Author"}** has been added to the queue!`);
    }

}

export default TrackAdd;