const EventEmitter = require('events').EventEmitter;

const MPDEvents = require('./events');
const MPDCommands = require('./api/commands');
const Status = require('./api/status');

class MpdDriver extends EventEmitter {
    /**
     *
     * @param options
     */
    constructor(options = {address: 'localhost', port: 6600}) {
        super();

        this.api = {};
        this.connected = true;
        this.options = options;
        this.__initializeMPDEventHandler(options);
        this.__initiateApi();
    }

    /**
     *
     * @private
     */
    __initiateApi() {
        this.mpdCommands = new MPDCommands(this.options);
        this.api.status = new Status(this.options);
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