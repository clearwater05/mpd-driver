const net = require('net');
const Command = require('../commands');

jest.mock('net');

const testString = `OK MPD 0.21.6
testValue1: 0
testValue2: 0
testValue3: 1
OK
`;

describe('MPD driver test suite', () => {
    describe('command.js test suite', () => {
        let command;
        let socketMock;

        beforeEach(() => {
            socketMock = {
                removeAllListeners: jest.fn(),
                write: jest.fn(),
                on: jest.fn(),
                destroy: jest.fn()
            };
            command = new Command();
            net.connect = jest.fn(async () => {
                return socketMock;
            });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('method "sendCommand" positive test', async () => {
            socketMock.on = (event, cb) => {
                cb(Buffer.from(testString));
            };
            const result = await command.sendCommand('test');
            const answer = [
                [ 'testValue1', '0' ],
                [ 'testValue2', '0' ],
                [ 'testValue3', '1' ]
            ];

            expect(net.connect).toHaveBeenCalledWith({address: 'localhost', port: 1000});
            expect(result).toEqual(answer);
            expect(socketMock.destroy).toHaveBeenCalled();
        });

        it('method "sendCommand negative test', async () => {
            socketMock.on = (event, cb) => {
                cb(Buffer.from('ACK [5@0] {} unknown command "test"'));
            };

            expect(command.sendCommand('test')).rejects.toThrow();
        });
    });
});