const socket = io('http://www.localhost:3000/')


//--------------------------------------
// SECOND DEVICE 
//--------------------------------------
// socket.on('connection', function (data) {
//   var url = window.location.href
//   var index = url.indexOf('=') 
//   console.log(index)
//   var shipId = url.substr(index+1)
//   $.get(`http://localhost:3000/ships/${shipId}`)
//   console.log(data);
//   console.log(`**${socket.id}`)
// })
var url = window.location.href
var index = url.indexOf('=')
console.log(index)
var shipId = url.substr(index + 1)
$.get(`http://localhost:3000/ships/${shipId}`)

socket.on('info', function (info) {
  // console.log(info)
  socket.emit('online', { data: info })
})

socket.on('disconnect', (data) => console.log(data))

socket.on('onlineShips', function (data) {
  console.log(data)
  // a.forEach(myFunction);
  // function myFunction(item, index) {
  //   document.getElementById('onlineShips').textContent += index + ":" + JSON.stringify(item) + '\n'
  // }
})

document.getElementById('sendToClient').addEventListener('click', function () {
  var clientIdWithMessage = document.getElementById('message').value
  var clientId = clientIdWithMessage.split(',')[0]
  var message = clientIdWithMessage.split(',')[1]
  console.log(clientId)
  console.log(message)

  socket.emit('message', { clientId: clientId, message: message })
})

socket.on('recieveMessage', function (message) {
  document.getElementById('recievedMessages').textContent += message + '\n'
})


// ------------------------------------------
// FIRST DEVICE
// ------------------------------------------

const { initPeer } = require('./peer');

document.getElementById("btn-open-or-join-room").addEventListener("click", function () {
  var roomId = document.getElementById("room").value
  socket.emit('joinRoom', roomId)
});

socket.on('joinedRoom', async function (data) {
  console.log(data.room)
  var room = data.room
  var Allpeers = [{}]
  var peer1 = await initPeer(true)
  Allpeers.push(peer1);

  socket.on('leftRoom', () => Allpeers.forEach(function(element) {
    console.log(element)
    peer1.destroy()
  }))

  peer1.on('error', (err) => console.log(err))

  console.log(peer1)
  var socketId = socket.id
  console.log(socketId)

    peer1.on('signal', function (data) {
      console.log(data)
      peer1.client = socketId
      if(peer1.connected === false){
      socket.emit('offer', { data: data, room: room, peer1: peer1 })
      }
    })

  socket.on('response', function(data) {
    if(peer1.connected === false){
      if (!peer1.destroyed) {
      peer1.signal(data)
      peer1.connected = true
    }
  }
  })

  peer1.on('stream', stream => {
    console.log(stream)

    document.getElementById('mute').addEventListener('click', function () {
      stream.getAudioTracks()[0].enabled = false;
    })

    document.getElementById('unmute').addEventListener('click', function () {
      stream.getAudioTracks()[0].enabled = true;
    })

    // got remote video stream, now let's show it in a video tag
    var video = document.createElement('video')
    document.body.appendChild(video)

    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }

    video.play()
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer1.send(yourMessage)
  })

  peer1.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n'
  })

})

socket.on('offer', async function (data) {
  var peer2 = await initPeer(false)
  var Allpeers = [{}]
  Allpeers.push(peer2);

  socket.on('leftRoom', () => Allpeers.forEach(function(element) {
    console.log(element)
    peer2.destroy()
  }))

  //socket.on('leftRoom', () => peer2.destroy())
  peer2.on('error', (err) => console.log(err))

  console.log(peer2)
  console.log(data)
  var room = data.room
  var clientId = data.clientId
  console.log(clientId)
  console.log(room)
  if(peer2.connected === false){
    if (!peer2.destroyed) {
  peer2.signal(data.data)
    }
  }

  peer2.on('signal', data => {
    //emitting response with offerer ID
    if(peer2.connected === false){
    socket.emit('response', { data: data, room: room, clientId: clientId })
    peer2.connected = true
    }
    console.log(data)
  })

  peer2.on('stream', stream => {
    console.log(stream)

    document.getElementById('mute').addEventListener('click', function () {
      stream.getAudioTracks()[0].enabled = false;
    })

    document.getElementById('unmute').addEventListener('click', function () {
      stream.getAudioTracks()[0].enabled = true;
    })

    // got remote video stream, now let's show it in a video tag
    var video = document.createElement('video')
    document.body.appendChild(video)

    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }

    video.play()
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer2.send(yourMessage)
  })

  peer2.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n'
  })
})

socket.on('joinedShips', (data) => console.log(data))

document.getElementById("btn-show-ships").addEventListener("click", function () {
  var roomId = document.getElementById("stefan").value;
  socket.emit('showJoinedShips', roomId)
});

document.getElementById("btn-leave-room").addEventListener("click", function () {
  var roomId = document.getElementById("room").value;
  console.log(roomId)
  socket.emit('leaveRoom', roomId)
});

socket.on('leftRoom', (data) => console.log(data))

