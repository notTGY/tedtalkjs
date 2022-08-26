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
  // nothing should be triggered after storing data
}

let roomId = null
let presentation = null
if (
  typeof document !== 'undefined'
  && document.location
) {
  const params = new URLSearchParams(
    document.location.search
  )
  roomId = params.get('r')
  presentation = params.get('p')
}
const getRoomId = () => roomId
const setRoomId = (newRoomId) => {
  roomId = newRoomId
  // update room data
}

const getPresentation = () => presentation
const setPresentation = (newPresentation) => {
  presentation = newPresentation
  // change data to different presentation
}

let data
if (presentation !== null) {
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

export default function useBrowserData() {
  return {
    getPresentation,
    setPresentation,
    getRoomId,
    setRoomId,
    getStored,
    setStored,
  }
}
