import happyFramework from '../framework'
import EditorTextarea from './EditorTextarea.jsx'

function asyncify(fn, ...props) {
  return new Promise((res, rej) => {
    try {
      fn(...props)
      res()
    } catch(e) {
      rej()
    }
  })
}

function rerenderThenFocusNthTextarea(rerender, n, soft=false) {
  asyncify(rerender, soft).then(() => {
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
    className: 'editor-plus',
    innerText: '+',
    ...props
  })
}

export default function Editor(props) {
  const {
    HostContext, data, className, rerender
  } = props
  const cleanData = data ?? []
  while(cleanData.length < 1) {
    cleanData.push('')
  }

  function deleteData(index) {
    const newData = cleanData
    newData.splice(index, 1)

    while(cleanData.length < 1) {
      cleanData.push('')
    }

    HostContext.socketHooks.setDataHook(newData)
    rerenderThenFocusNthTextarea(
      rerender,
      index >= newData.length
        ? newData.length - 1
        : index
    )
  }

  function changeData(index, value) {
    if (!value) {
      deleteData(index)
      return
    }
    const newData = cleanData
    newData[index] = value

    HostContext.socketHooks.setDataHook(newData)
    rerenderThenFocusNthTextarea(rerender, index, true)
  }

  function addToData(afterIndex) {
    const newData = cleanData
    newData.splice(afterIndex + 1, 0, '')

    HostContext.socketHooks.setDataHook(newData)
    rerenderThenFocusNthTextarea(
      rerender, afterIndex + 1
    )
  }

  function goTo(index) {
    const isUpdated = HostContext
      .socketHooks
      .setSlideHook(index)
    if (isUpdated) {
      rerenderThenFocusNthTextarea(rerender, index, true)
    }
  }

  const children = cleanData.reduce(
    (children, slide, index) => {
      const textarea = EditorTextarea({
        data: slide,
        oninput:e => changeData(index, e.target.value),
        ondelete: e => deleteData(index),
        onfocus:() => goTo(index),
      })

      return [
        ...children,
        textarea,
        <Plus onclick={() => addToData(index)}/>,
      ]
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
