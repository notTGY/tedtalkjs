import happyFramework from '../framework'

export default function EditorTextarea(props) {
  const { data, oninput, onfocus } = props

  return ({
    elem: 'textarea',
    value: data,
    oninput,
    onfocus,
  })
}
