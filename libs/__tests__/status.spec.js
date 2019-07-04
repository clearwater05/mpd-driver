const Commands = require('../api/commands');
const {keyValueParse} = require('../utils/parsers');

jest.mock('../api/commands');
jest.mock('../utils/parsers');

const Status = require('../api/status');

describe('MPD driver test suite', () => {
    describe('status test suite', () => {
        const testData = 'testValue1: 0\ntestValue2: 0\ntestValue3: 1';
        let status;

        beforeEach(() => {
            status = new Status();
        });

        it('method "currentSong" test', async () => {
            status.sendCommand = jest.fn(() => {
                return testData;
            });

            await status.currentSong();
            expect(status.sendCommand).toHaveBeenCalled();
            expect(keyValueParse).toHaveBeenCalledWith(testData);
        });

        it('method "mpdStatus" test', async () => {
            status.sendCommand = jest.fn(() => {
                return testData;
            });

            await status.mpdStatus();
            expect(status.sendCommand).toHaveBeenCalled();
            expect(keyValueParse).toHaveBeenCalledWith(testData);
        });

        it('method "stats" test', async () => {
            status.sendCommand = jest.fn(() => {
                return testData;
            });

            await status.stats();
            expect(status.sendCommand).toHaveBeenCalled();
            expect(keyValueParse).toHaveBeenCalledWith(testData);
        });
    });
});