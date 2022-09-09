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
    const isSelect = socketHooks.useStartSelect(
      (e) => rerender(e)
    )

    const stored = getStored() ?? {}

    if (isSelect) {
      const navigate = p => {
        window.location = `?r=${roomId}&p=${p}`
      }

      const p = Date.now()

      if (stored.ondevice) {
        const pres = Object.keys(stored.ondevice)
        const jsx = pres.map(name => ({
                elem: 'li',
                innerText: name,
                onclick: () => navigate(name)
              }))

        jsx.push({
          elem: 'li',
          innerText: 'new',
          onclick: () => navigate(p)
        })


        return (
          <div id="root">
            <ul>
            { jsx }
            </ul>
          </div>
        )
      } else {
        navigate(p)
      }
    }

    let slides = ['']
    if (stored.rooms && stored.rooms[roomId]) {
      slides = stored.rooms[roomId]
    }
    const curSlide = 0
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
        rerender:(e) => rerender(e),
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
      rerender: (e) => rerender(e),
      curSlide,
    })
  }
}

rerender = happyFramework.init(
  document.getElementById('root'), App
)
