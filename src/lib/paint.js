import mmd from './mmd.js'

export default function render(data) {
  const md = mmd(data || '')
  return '<article class="markdown-body">' + md + '</article>'
}
