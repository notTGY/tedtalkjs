import happyFramework from '../framework.js'

export default function FullCenter(props) {
  return {
    className: `full-center ${props.className}`,
    children: props.children,
  }
}
