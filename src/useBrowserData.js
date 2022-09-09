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

function select(presentationId) {
  const { curSlide } = getStored() ?? { curSlide: 0 }
  const { ondevice } = getStored() ?? { ondevice: {} }
  const slideData = ondevice[presentationId]
  socket.emit(
    'presentation-start', 
    { slideData, curSlide }
  )
}

socket.on('control-connected', () => {
  if (presentationId !== null) {
    return select(presentationId)
  }
})

let isSelecting = false
function useStartSelect(rerender) {

  socket.on('control-connected', () => {
    if (presentationId !== null) {
      return select(presentationId)
    }
    isSelecting = true
    rerender()
  })
  return isSelecting ? select : null
}

if (roomId !== null) {
  socket.emit('control-requested', roomId)
}

const getRoomId = () => roomId
const setRoomId = (newRoomId) => {
  roomId = newRoomId
}

const getPresentationId = () => presentationId
const setPresentationId = (newPresentationId) => {
  presentationId = newPresentationId
}

let data = null
if (presentationId !== null) {
  const stored = getStored() ?? {ondevice: {}}
  if (stored.ondevice) {
    data = stored.ondevice[presentationId]
  } else {
    data = ['']
  }
}

const getData = () => data
const setData = (newData) => {
  if (presentationId === null) {
    throw new Error(
      `Trying to set data of unexisting presentation`
    )
  }

  data = newData
  const stored = getStored() ?? {ondevice:{}}
  const oldOndevice = stored.ondevice
  const changed = {}
  changed[presentationId] = newData
  const ondevice = {...oldOndevice, ...changed }
  setStored({...stored, ondevice })
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

const setDataHook = (slideData) => {
  setData(slideData)

  const stored = getStored() ?? {}
  const curSlide = stored.curSlide ?? 0

  const newStored = {
    ...stored, curSlide: data.curSlide
  }

  setStored(newStored)

  if (roomId !== null) {
    socket.emit(
      'presentation-start', 
      { slideData, curSlide }
    )
  }
}

const setSlideHook = (curSlide) => {
  const stored = getStored() ?? {}
  if (stored.curSlide === curSlide) {
    // do not update unnecessary
    return false
  }

  setStored({
    ...stored, curSlide
  })

  socket.emit('go-to-slide', curSlide)
  return true
}

const socketHooks = {
  createRoom,
  onDataReceived,
  onSlideChanged,
  setDataHook,
  setSlideHook,
  useStartSelect,
}

export default function useBrowserData() {
  return {
    getPresentationId,
    setPresentationId,
    getRoomId,
    setRoomId,
    getStored,
    setStored,
    getData,
    setData,
    socketHooks,
  }
}
