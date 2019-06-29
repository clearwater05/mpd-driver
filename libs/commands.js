const net = require('net');

const MPD_SERVICE_SEQUENCE = /^(OK|ACK|list_OK)(.*)$/m;

class MPDCommands {
    constructor(options = {address: 'localhost', port: 1000}) {
        this.options = options;
    }

    /**
     *
     * @param command
     * @returns {Promise<Array>}
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

    __parseData(data) {
        const result = [];
        data.split('\n').forEach((line, index) => {
            const r = line.match(MPD_SERVICE_SEQUENCE);

            if (r && r[1] === 'ACK') {
                throw r[2];
            }

            if (!r && line) {
                const values = line.split(':').map((val) => val.trim());
                result.push(values);
            }
        });

        return result;
    }

    /**
     *
     * @param socket
     * @param command
     * @returns {Promise<Array>}
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