import happyFramework from '../framework'
import EditorTextarea from './EditorTextarea.jsx'

function asyncify(fn) {
  return new Promise((res, rej) => {
    try {
      fn()
      res()
    } catch(e) {
      rej()
    }
  })
}

function rerenderThenFocusNthTextarea(rerender, n) {
  asyncify(rerender).then(() => {
    const textareas = document.querySelectorAll(
      'textarea'
    )
    const textarea = textareas[n]
    if (textarea) {
      textarea.focus()
      textarea.scrollIntoView()
    }
  })
}

function Plus(props) {
  return ({
    elem: 'button',
    innerText: '+',
    ...props
  })
}

export default function Editor(props) {
  const {
    HostContext, data, className, rerender
  } = props
  const cleanData = data ?? []
  if (
    cleanData.length === 0 ||
    cleanData[cleanData.length - 1].trim() !== ''
  ) {
    cleanData.push('')
  }

  function changeData(index, value) {
    if (value) {
      const newData = cleanData
      newData[index] = value

      HostContext.socketHooks.setDataHook(newData)
      rerenderThenFocusNthTextarea(rerender, index)
    } else {
      const newData = cleanData
      newData.splice(index, 1)

      HostContext.socketHooks.setDataHook(newData)
      rerenderThenFocusNthTextarea(rerender, index)
    }
  }

  function addToData(beforeIndex) {
    const newData = cleanData
    newData.splice(beforeIndex, 0, '')

    HostContext.socketHooks.setDataHook(newData)
    rerenderThenFocusNthTextarea(
      rerender, beforeIndex
    )
  }

  function goTo(index) {
    const isUpdated = HostContext
      .socketHooks
      .setSlideHook(index)
    if (isUpdated) {
      rerenderThenFocusNthTextarea(rerender, index)
    }
  }

  const children = cleanData.reduce(
    (children, slide, index) => {
      const textarea = EditorTextarea({
        data: slide,
        oninput:e => changeData(index, e.target.value),
        onfocus:() => goTo(index),
      })

      if (index > 0) {
        return [
          ...children,
          <Plus onclick={() => addToData(index)}/>,
          textarea,
        ]
      }
      return [...children, textarea]
    },
    []
  )

  const slidesJsx = ({
    elem: 'div',
    className,
    style: 'display:flex;flex-direction:column;overflow:auto;',
    children,
  })

  return slidesJsx
}
