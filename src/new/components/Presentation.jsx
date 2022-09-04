import happyFramework from '../framework'
import mmd from '../mmd'

export default function Presentation(props) {
  const { className, data } = props
  return ({
    elem: 'section',
    id: 'pres-root',
    style: 'margin: 0, width: 100%; height: 100%; display: flex; justify-content: center;',
    className,
    children: [{
      elem: 'article',
      className: 'markdown-body',
      innerHTML: mmd(data),
    }]
  })
}
