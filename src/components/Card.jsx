import happyFramework from '../framework.js'

export default function Card(props) {
  const { children, className } = props
  const cn = `claycard ${className}`

  return {
    elem: 'div',
    className: "card-container",
    children: [{
      elem: 'div',
      className: cn,
      children,
    }]
  }
}
