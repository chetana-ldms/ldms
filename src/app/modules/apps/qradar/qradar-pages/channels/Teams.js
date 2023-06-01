import React from 'react'

function TeamsIntegration() {
  // const liveEventUrl = 'https://teams.live.com/meet/1234567890123456'
  const chatUrl = 'https://teams.live.com/_#/conversations/?ctx=chat'

  return (
    <div>
      <h1>My Microsoft Teams Live Event</h1>
      {/* <iframe src={liveEventUrl} width='800' height='600' /> */}
      <iframe src={chatUrl} width='800' height='600' />
    </div>
  )
}

export default TeamsIntegration
