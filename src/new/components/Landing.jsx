import happyFramework from '../framework.js'
import Background from './Background.jsx'
import Icon from './Icon.jsx'
import FullCenter from './FullCenter.jsx'
import Button from './Button.jsx'
import Card from './Card.jsx'

let qrcode = null

function CreateButton() {
  return (
    <Button type="pill" color="#45ef45">
      <div style="display:flex;color:#efe;font-size:1.2rem;align-items:center;">
        <div
          style="border-radius:100%;border:2px solid #efe;width:16px;height:16px;vertical-align:center;margin-right:4px;"
        />
        create
      </div>
    </Button>
  )
}

function H() {
  return (
    <h1
      style="margin:1rem;margin-top:1.5rem;"
    >
      Metaslides
    </h1>
  )
}

export default function Landing(props) {
  const {rerender, LandingContext} = props

  if (qrcode === null) {
    LandingContext.socketHooks.createRoom(
      (qr, id) => {
        console.log(id)
        qrcode = qr
        rerender()
      }
    )

    LandingContext
      .socketHooks
      .onDataReceived(rerender)
  }

  return (
    <div id="root">
      <Background></Background>
        <div id="app-container" style="font-family:Arial;color:412B2B;overflow:auto;">
          <div style="display: flex;justify-content:space-between;">
            <H/>
            <div style="margin:1rem;">
              <CreateButton/>
            </div>
          </div>
          <Card style="margin-top:1rem;">
            <p>
              🌌 Metaslides is a metaverse platform
              for giving {' '}
              <u>collaborative standup talks</u>.
            </p>
            <p>
              🪂 It replaces traditional presentation
              and {' '}
              <u>enriches its' experience</u> {' '}
              by giving everyone ability participate.
            </p>
            <p>
              🏗️ You can {' '}
              <u>add behaviours yourself</u> {' '}
              from building blocks like button,
              choice or text input.
              Make anonymous polls and receive
              results over email.
            </p>
            <p>
              🚀 fast and simple. {' '}
              <u>No rocket science involved</u>.
              You just type text and see changes in
              real time.
            </p>
            <p style="margin-top:2rem;">
              To create your own interactive experience scan QR code, or press <b>Create</b> button.
            </p>
          </Card>
          <FullCenter style="margin-top:3rem;">
            <Icon width={320} qrcode={qrcode}/>
          </FullCenter>
        </div>
    </div>
  )
}
