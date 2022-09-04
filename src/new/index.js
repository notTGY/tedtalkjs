import happyFramework from './framework.js'
let rerender
import useBrowserData from './useBrowserData.js'
const {
  getPresentationId, setPresentationId,
  getRoomId, setRoomId,
  getStored, setStored,
  getData, setData,
  socketHooks,
} = useBrowserData()

import Landing from './components/Landing.jsx'
import Presentation from './components/Presentation.jsx'
import Host from './components/Host.jsx'

const App = () => {
  const roomId = getRoomId()
  const presentationId = getPresentationId()

  if (presentationId === null && roomId !== null) {
    const stored = getStored() ?? {rooms:{}}
    const slides = stored.rooms[roomId] ?? ['']
    const curSlide = stored.curSlide ?? 0
    const data = slides[curSlide]

    return (
      <div id="root">
        <Presentation data={data} />
      </div>
    )
  } else if (
    presentationId === null && roomId === null
  ) {
    return Landing({
        rerender:() => rerender(),
        LandingContext: {
          socketHooks,
          setPresentationId,
        },
      })
  } else if (presentationId !== null) {
    const isOnline = roomId !== null
    const data = getData()

    const stored = getStored() ?? {rooms:{}}
    const curSlide = stored.curSlide ?? 0

    return Host({
      isOnline,
      data,
      HostContext: {
        socketHooks,
      },
      rerender: () => rerender(),
      curSlide,
    })
  }
}

rerender = happyFramework.init(
  document.getElementById('root'), App
)
