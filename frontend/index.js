const socket = io('http://www.localhost:3000/')
socket.on('connection', (data) => console.log(data))

document.getElementById("btn-open-or-join-room").addEventListener("click", function () {
  var roomId = document.getElementById("room").value;
  socket.emit('joinRoom', roomId)
});


socket.on('joinedShips', (data) => console.log(data))

document.getElementById("btn-show-ships").addEventListener("click", function () {
  var roomId = document.getElementById("roomId").value;
  socket.emit('showJoinedShips', roomId)
});

document.getElementById("btn-leave-room").addEventListener("click", function () {
  var roomId = document.getElementById("room").value;
  console.log(roomId)
  socket.emit('leaveRoom', roomId)
});

socket.on('leftRoom', (data) => console.log(data))

const { initPeer } = require('./peer');

// ------------------------------------------

socket.on('joinedRoom', async function (data) {
  console.log(data.room)
  var room = data.room

  var peer1 = await initPeer(true)
  console.log(peer1)

  peer1.on('signal', data => {
    socket.emit('offer', {data: data, room: room})
    console.log(data)
  })

  socket.on('response', (data) => peer1.signal(data))

  peer1.on('stream', stream => {
    console.log(stream)
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
  console.log(peer2)
  console.log(data)
  var room= data.room
  var clientId = data.clientId
  console.log(clientId)
  console.log(room)
  peer2.signal(data.data)


  peer2.on('signal', data => {
    //emitting response with offerer ID
    socket.emit('response',  {data:data, room: room, clientId: clientId})
    console.log(data)

  })


  peer2.on('stream', stream => {
    console.log(stream)
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

