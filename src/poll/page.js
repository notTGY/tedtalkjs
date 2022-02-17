export function render(cb) {
  const main = document.querySelector('main')

  const input = document.createElement('input')
  input.placeholder = 'message...'
  const button = document.createElement('button')
  button.innerText = 'send'
  
  button.addEventListener('click', e => {

  })
  main.appendChild(input)
  main.appendChild(button)
}
