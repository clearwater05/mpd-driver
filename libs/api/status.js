const Commands = require('./commands');
const {keyValueParse} = require('../utils/parsers');

class Status extends Commands {
    constructor(props) {
        super(props);
    }

    /**
     *
     * @returns {Promise<Array>}
     */
    async currentSong() {
        const song = await this.sendCommand('currentsong');

        return keyValueParse(song);
    }

    /**
     *
     * @returns {Promise<Array>}
     */
    async mpdStatus() {
        const status = await this.sendCommand('status');

        return keyValueParse(status);
    }

    /**
     *
     * @returns {Promise<Array>}
     */
    async stats() {
        const stats = await this.sendCommand('stats');

        return keyValueParse(stats);
    }
}

module.exports = Status;
