const Peer = require('simple-peer');
const wrtc = require('wrtc')
const getUserMedia = require('get-user-media-promise');


const initPeer = async (initiator) => {
  const peerInfo = {
    initiator,
    trickle: false,
    connected: false,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.l.google.com:19302?transport=udp' },
      ]
    }
  };

  // /* Get stream data from user's browser */
  const stream = await getUserMedia({ audio: true, video: true })

  /* Attach the stream to the peerInfo object */
  peerInfo.stream = stream;

  return new Peer(peerInfo);
};

module.exports = {
  initPeer,
}
