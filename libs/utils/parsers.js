const {MPD_SERVICE_SEQUENCE} = require('./constants');

/**
 *
 * @param data
 */
function keyValueParse(data) {
    const result = {};
    data.split('\n').forEach((line) => {
        const r = line.match(MPD_SERVICE_SEQUENCE);

        if (!r && line) {
            const values = line.split(': ').map((val) => val.trim());
            result[values[0]] = values[1];
        }
    });

    return result;
}

module.exports = {
    keyValueParse
};