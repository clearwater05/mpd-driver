require('../commands');
require('../events');


jest.mock('../commands');
jest.mock('../events');

const MpdClient = require('../mpd-driver');

describe('MPD driver test suite', () => {
    describe('mpd-driver.js test suite', () => {
        let mpdClient;
        beforeEach(() => {
            mpdClient = new MpdClient();
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it('method sendCommand() test', async () => {
            await mpdClient.sendCommand('test');
            expect(mpdClient.mpdCommands.sendCommand).toHaveBeenCalledWith('test');
        });

        it('method sendCommand() negative test', async () => {
            mpdClient.mpdCommands.sendCommand = async () => {
                throw new Error('[5@0] {} unknown command "test"');
            };
            await expect(mpdClient.sendCommand('test')).rejects.toThrow();
        });
    });
});