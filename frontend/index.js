const URL = 'http://localhost:3000'
const socket = io(URL)
var STREAM = new Array();


//--------------------------------------
// SECOND DEVICE 
//--------------------------------------
const url = window.location.href
const index = url.indexOf('=')
const shipId = url.substr(index + 1)

$.get(`${URL}/ships/${shipId}`, (info) => {
  socket.emit('online', info)
})

socket.on('disconnect', (data) => console.log(data))

document.getElementById('sendToClient').addEventListener('click', () => {
  const clientIdWithMessage = document.getElementById('message').value
  const clientId = clientIdWithMessage.split(',')[0]
  const message = clientIdWithMessage.split(',')[1]
  socket.emit('message', { clientId: clientId, message: message })
})

socket.on('recieveMessage', (message) => {
  document.getElementById('recievedMessages').textContent += message + '\n'
})


// ------------------------------------------
// FIRST DEVICE
// ------------------------------------------

const { initPeer } = require('./peer');

document.getElementById("btn-open-or-join-room").addEventListener("click", () => {
  const roomId = document.getElementById("room").value
  socket.emit('joinRoom', roomId)
});

document.getElementById("btn-leave-room").addEventListener("click", () => {
  const roomId = document.getElementById("room").value
  socket.emit('leaveRoom', roomId)
});

socket.on('joinedRoom', async (data) => {
  const room = data.room
  const peer1 = await initPeer(true)

  socket.on('leftRoom', () => {
    peer1.destroy()
  })

  peer1.on('signal', (data) => {
    if (peer1.connected === false) {
      socket.emit('offer', { data: data, room: room })
    }
  })

  socket.on('response', (data) => {
    if (peer1.connected === false && !peer1.destroyed) {
      peer1.signal(data)
      peer1.connected = true
    }
  })

  peer1.on('stream', (stream) => {
    STREAM.push(stream)
    const video = myFunction(stream);
    video.play()

    document.getElementById('mute').addEventListener('click', () => {
      const streamToSend = peer1.stream.id
      peer1.send(streamToSend)
    })
  })
  // Sending messages betweeen peers
  //-------------------------------
  document.getElementById('send').addEventListener('click', () => {
    const yourMessage = document.getElementById('yourMessage').value
    peer1.send(yourMessage)
  })

  peer1.on('data', (id) => {
    var streamToMute = STREAM.find(obj => {
      return obj.id === id
    })
    if (streamToMute.getAudioTracks()[0].enabled == true) {
      streamToMute.getAudioTracks()[0].enabled = false;
    }
    else {
      streamToMute.getAudioTracks()[0].enabled = true;
    }
    document.getElementById('messages').textContent += data + '\n'
  })
})

socket.on('offer', async (data) => {
  const room = data.room
  const peer2 = await initPeer(false)

  socket.on('leftRoom', () => {
    peer2.destroy()
  })

  if (!peer2.destroyed) {
    peer2.signal(data.data)
  }

  const clientId = data.clientId
  peer2.on('signal', (data) => {
    socket.emit('response', { data: data, room: room, clientId: clientId })
  })

  peer2.on('stream', (stream) => {
    STREAM.push(stream)
    const video = myFunction(stream);
    video.play()

    document.getElementById('mute').addEventListener('click', () => {
      const streamToSend = peer2.stream.id
      peer2.send(streamToSend)
    })
  })

  // Sending messages betweeen peers
  //-------------------------------
  document.getElementById('send').addEventListener('click', () => {
    const yourMessage = document.getElementById('yourMessage').value
    peer2.send(yourMessage)
  })

  peer2.on('data', (id) => {
    var streamToMute = STREAM.find(obj => {
      return obj.id === id
    })
    if (streamToMute.getAudioTracks()[0].enabled == true) {
      streamToMute.getAudioTracks()[0].enabled = false;
    }
    else {
      streamToMute.getAudioTracks()[0].enabled = true;
    }
    document.getElementById('messages').textContent += data + '\n'
  })
})

socket.on('onlineShips', (data) => console.log(data))

document.getElementById("btn-show-online-ships").addEventListener("click", () => {
  socket.emit('showOnlineShips', 'testing')
});
//-------------------------------

function myFunction(stream) {
  const video = document.createElement('video')
  document.body.appendChild(video)
  if ('srcObject' in video) {
    video.srcObject = stream
  } else {
    video.src = window.URL.createObjectURL(stream)
  }

  return video;
}
