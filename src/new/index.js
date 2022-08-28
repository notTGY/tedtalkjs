import happyFramework from './framework.js'
let rerender
import useBrowserData from './useBrowserData.js'
const {
  getPresentationId, setPresentationId,
  getRoomId, setRoomId,
  getStored, setStored,
  socketHooks,
} = useBrowserData()

import Landing from './components/Landing.jsx'

const App = () => {
  const roomId = getRoomId()
  const presentationId = getPresentationId()

  if (roomId !== null && presentationId === null) {
    return (
      <div id="root">
        Joined as a viewer
      </div>
    )
  } else if (
    roomId === null && presentationId !== null
  ) {
    return (
      <div id="root">
        Editing presentation without presenting
      </div>
    )
  } else if (
    roomId !== null && presentationId !== null
  ) {
    return (
      <div id="root">
        Presenting. You are presenter
      </div>
    )
  } else {
    return Landing({
        rerender:() => rerender(),
        LandingContext:{
          socketHooks,
        },
      })
  }
}

rerender = happyFramework.init(
  document.getElementById('root'), App
)
