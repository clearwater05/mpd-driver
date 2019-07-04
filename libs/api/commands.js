const net = require('net');
const {MPD_SERVICE_SEQUENCE} = require('../utils/constants');

class MPDCommands {
    constructor(options = {address: 'localhost', port: 1000}) {
        this.options = options;
    }

    /**
     *
     * @param command
     * @returns {Promise<any>}
     */
    async sendCommand(command) {
        try {
            let socket = await net.connect(this.options);
            const data = await this.__sendCommand(socket, command);
            await socket.destroy();

            return data;
        } catch (e) {
            throw new Error(e);
        }
    }

    /**
     *
     * @param data
     * @returns {String}
     * @private
     */
    __parseData(data) {
        const result = data.trim().split('\n');
        const r = result.pop().match(MPD_SERVICE_SEQUENCE);

        result.shift();

        if (r && r[1] === 'ACK') {
            throw r[2];
        }

        return result.join('\n');
    }

    /**
     *
     * @param socket
     * @param command
     * @returns {Promise<any>}
     * @private
     */
    __sendCommand(socket, command) {
        return new Promise((resolve, reject) => {
            const dataHandler = (data) => {
                socket.removeAllListeners();
                try {
                    const result = this.__parseData(data.toString());
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            };
            const errorHandler = error => {
                socket.removeAllListeners();
                reject(error);
            };

            socket.on('data', dataHandler);
            socket.on('error', errorHandler);
            socket.write(`${command}\n`);
        });
    }
}

module.exports = MPDCommands;