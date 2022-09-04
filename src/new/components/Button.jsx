import happyFramework from '../framework.js'

export default function Button(props) {
  const {
    type, width, height, color, ...rest
  } = props

  const background = 
  `background: linear-gradient(155deg, #0000, #0001), ${color};`

  return {
    elem: 'button',
    className: `button-${type}`,
    style: `width:${width};height:${height};${background}`,
    ...rest,
  }
}
