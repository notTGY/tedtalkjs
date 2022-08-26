import happyFramework from './framework.js'
import useBrowserData from './useBrowserData.js'

const {
  getPresentation, setPresentation,
  getRoomId, setRoomId,
  getStored, setStored,
} = useBrowserData()

const App = () => {
  const roomId = getRoomId()
  const presentation = getPresentation()

  if (roomId !== null && presentation === null) {
    return (
      <div id="root">
        Joined as a viewer
      </div>
    )
  } else if (roomId === null && presentation !== null) {
    return (
      <div id="root">
        Editing presentation without presenting
      </div>
    )
  } else if (roomId !== null && presentation !== null) {
    return (
      <div id="root">
        Presenting. You are presenter
      </div>
    )
  } else {
    return (
      <div id="root">
          Landing.
          CTA to create new presentation.
          QR code and room id to start presenting.
      </div>
    )
  }
}

const rerender = happyFramework.init(document.getElementById('root'), App) 
