const EventEmitter = require('events').EventEmitter;

const MPDEvents = require('./events');
const MPDCommands = require('./commands');

class MpdDriver extends EventEmitter {
    /**
     *
     * @param options
     */
    constructor(options = {address: 'localhost', port: 6600}) {
        super();

        this.connected = true;
        this.__initializeMPDEventHandler(options);
        this.mpdCommands = new MPDCommands(options);
    }

    /**
     *
     * @param options
     * @private
     */
    __initializeMPDEventHandler(options) {
        this.events = new MPDEvents(options);
        this.events.on('mpd-event', this.__mpdEventsEmmiter.bind(this));
    }

    /**
     *
     * @param event
     * @private
     */
    __mpdEventsEmmiter(event) {
        this.emit(`system-${event}`);
        this.emit('system', event);
    }

    /**
     *
     * @param command
     * @returns {Promise<Array>}
     */
    async sendCommand(command) {
        try {
            return await this.mpdCommands.sendCommand(command);
        } catch (e) {
            throw new Error(e);
        }
    }
}

module.exports = MpdDriver;