const EventEmitter = require('events').EventEmitter;
const net = require('net');

const promisedTimeout = time => {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
};

class MpdEvents extends EventEmitter {
    /**
     *
     * @param options
     */
    constructor(options = {address: 'localhost', port: 6600, attempts: 10}) {
        super();
        this.options = options;
        this.attempts = 0;

        this.__connect(options);
    }

    /**
     *
     * @param options
     * @private
     */
    __connect(options) {
        this.socket = net.connect(options, async () => {
            this.attempts = 0;
            this.emit('connected');
        });

        this.socket.on('data', this.__recieveMPDEvent.bind(this));
        this.socket.on('error', this.__handleError.bind(this));
        this.socket.on('end', this.__handleConnectionEnd.bind(this));
    }

    /**
     *
     * @param data
     * @private
     */
    __recieveMPDEvent(data) {
        data.toString().split('\n').forEach((system) => {
            if (system.length > 0) {
                const name = system.substring(9);

                if (name) {
                    this.emit('mpd-event', name);
                }
            }
        });
        this.socket.write('idle\n');
    }

    /**
     *
     * @returns {Promise<void>}
     * @private
     */
    async __handleConnectionEnd() {
        this.socket.removeAllListeners();
        this.__connect(this.options);
    }

    /**
     *
     * @param error
     * @private
     */
    async __handleError(error) {
        this.emit('connection_error');
        if (this.attempts < this.options.attempts) {
            this.attempts++;
            await promisedTimeout(1000);
            await this.__handleConnectionEnd();
        }
        throw error;
    }
}

module.exports = MpdEvents;