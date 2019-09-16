import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:5000');

const downloadPercentage = cb => {
    socket.on('percentagePing', bytesDone => cb(null, bytesDone));
}

export { downloadPercentage };