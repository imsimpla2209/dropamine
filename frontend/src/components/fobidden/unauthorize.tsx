import './unauthorize.css'

export default function UnAuthorize() {
  return (
    <>
      <div className="message">You are not authorized.</div>
      <div className="message2">You tried to access a page you did not have prior authorization for.</div>
      <div className="container">
        <div className="neon">403</div>
      </div>
    </>
  )
}
