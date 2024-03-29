const frag = Symbol()

function dom(elem, props, ...children) {
  if (elem === frag) return children
  if (typeof elem === 'function') return elem({...props, children})
  return { ...props, elem, children }
}

const init = ($el, fn) => {
  let prevJson = {$el, elem: $el.nodeName.toLowerCase()}, tmp

  const render = (soft) => {
    if (!soft) {
      $el.innerHTML = ''
      prevJson = El({
        $el, elem: $el.nodeName.toLowerCase()
      }, fn(), $el)
    } else {
      prevJson = El(prevJson, fn(), $el)
    }
  }

  const El = (prev, cur, root) => {
    if (Array.isArray(cur)) cur = { children: cur }
    if (typeof cur === 'string') cur = { innerText: cur }

    cur.elem = cur.elem || 'span'

    if (!prev || (prev.elem !== cur.elem)) {
      cur.$el = document.createElement(cur.elem)
      root.append(cur.$el)
    } else {
      cur.$el = prev.$el
      cur.cleanup = prev.cleanup
    }

    let {
      $el, elem, children, cleanup, ...rest
    } = cur

    if (cleanup) for (let key in cleanup) {
      $el.removeEventListener(key.substring(2), cur.cleanup[key])
    }

    cur.cleanup = {}

    for (let key in rest) {
      if (typeof (tmp = rest[key]) == 'undefined')
        continue

      if (key.indexOf('on') != 0) {
        $el[key] = tmp
      } else {
        $el.addEventListener(
          key.substring(2),
          cur.cleanup[key] = e => {
            rest[key](e)
          }
        )
      }
    }

    if (children)
      return {
        ...cur,
        children: children.map((child, i) => El(
          prev && prev.children && prev.children[i],
          child,
          $el
        ))
      }

    return cur
  }

  render()

  return render
}

export default { frag, dom, init }

