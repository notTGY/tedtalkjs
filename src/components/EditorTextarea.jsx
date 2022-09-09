import happyFramework from '../framework'

export default function EditorTextarea(props) {
  const { data, oninput, onfocus, ondelete } = props

  return ({
    elem: 'textarea',
    value: data,
    className: 'editor-textarea',
    oninput,
    onfocus,
    onkeyup: e => {
      if (
        e.target.value === '' && e.key === 'Backspace'
      ) {
        ondelete()
      }
    }
  })
}
