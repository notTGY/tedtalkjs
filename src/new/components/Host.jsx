import happyFramework from '../framework'
import Editor from './Editor.jsx'
import Presentation from './Presentation.jsx'

export default function Host(props) {
  const {
    isOnline, HostContext, data, rerender, curSlide
  } = props
  // to handle different screen sizes
  document.body.onresize = rerender

  const width = document.body.offsetWidth
  const PresentationJsx = (
    <Presentation data={data[curSlide]}/>
  )

  const EditorJsx = (
    <>
      {
        isOnline
        ? "Presenting. You are presenter"
        : "Editing presentation without presenting"
      }
      <Editor
        HostContext={HostContext}
        data={data}
        rerender={rerender}
      />
    </>
  )
  if ((width > 640) || true) {
    return ({
      elem: 'div',
      id: 'root',
      style: 'width:100%;display:flex;justify-content:center;',
      children: [
        <div style="overflow:auto;width:320px;">
          {EditorJsx}
        </div>,
        <div style="overflow:auto;width:320px;border:1px solid #ccc;">
          {PresentationJsx}
        </div>
      ]
    })
  }
}
