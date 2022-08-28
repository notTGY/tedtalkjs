// handle all data through here
const socket = io()


let storage = null
if (
  typeof window !== 'undefined'
  && window.localStorage
) {
  try {
    const json = window.localStorage.getItem(
      'user-data'
    )
    storage = JSON.parse(json)
  } catch (e) {}
}
const getStored = () => storage
const setStored = (data) => {
  if (
    typeof window !== 'undefined'
    && window.localStorage
  ) {
    const json = JSON.stringify(data)
    window.localStorage.setItem('user-data', json)
  }
  storage = data
}

let roomId = null
let presentationId = null
if (
  typeof document !== 'undefined'
  && document.location
) {
  const params = new URLSearchParams(
    document.location.search
  )
  roomId = params.get('r')
  presentationId = params.get('p')
}
const getRoomId = () => roomId
const setRoomId = (newRoomId) => {
  roomId = newRoomId
  // update room data
}

const getPresentationId = () => presentationId
const setPresentationId = (newPresentationId) => {
  presentationId = newPresentationId
  // change data to different presentation
}

let data
if (presentationId !== null) {
  const stored = getStored()
  if (stored.ondevice) {
    data = stored.ondevice[presentation]
  } else {
    // accessing missing presentation.
  }
}

const getData = () => data
const setData = (newData) => {
  data = newData
  // update localstorage
  // update room status
}

let createRoomCallback = () => {}
let currentRoom = null
const createRoom = (callback) => {
  socket.emit('create-room')
  currentRoom = null
  createRoomCallback = callback
}

socket.on('room-created', (qr, id) => {
  createRoomCallback(qr, id)
  currentRoom = id
})

let onDataReceivedCallback = () => {}
const onDataReceived = (callback) => {
  onDataReceivedCallback = callback
}

socket.on('data-received', (data) => {
  const stored = getStored() ?? {rooms:{}}
  const stored_rooms = stored.rooms

  const new_room = {}
  new_room[currentRoom] = data.slideData

  const rooms = {...stored_rooms, ...new_room}
  const newStored = {
    ...stored, rooms, curSlide: data.curSlide
  }

  setStored(newStored)
  setRoomId(currentRoom)

  onDataReceivedCallback(data)
})

let onSlideChangedCallback = () => {}
const onSlideChanged = (callback) => {
  onSlideChangedCallback = callback
}
socket.on('go-to-slide', n => {
  const stored = getStored() ?? {}

  const newStored = {
    ...stored, curSlide: data.curSlide
  }

  setStored(newStored)

  onSlideChangedCallback(n)
})

const socketHooks = {
  createRoom,
  onDataReceived,
  onSlideChanged,
}

export default function useBrowserData() {
  return {
    getPresentationId,
    setPresentationId,
    getRoomId,
    setRoomId,
    getStored,
    setStored,
    socketHooks,
  }
}
