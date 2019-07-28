const Peer = require('simple-peer');
const wrtc = require('wrtc')
const getUserMedia = require('get-user-media-promise');

const initPeer = async (initiator) => {
  const peerInfo = {
    initiator,
    trickle: false,
    wrtc: wrtc,
    config: {
      iceServers: [
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun1.l.google.com:19302' },
        { url: 'stun:stun2.l.google.com:19302' },
        { url: 'stun:stun.l.google.com:19302?transport=udp' },
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
