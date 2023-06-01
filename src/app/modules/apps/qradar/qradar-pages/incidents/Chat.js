import React, {useEffect, useState} from 'react'
// import ChatFeed from "react-chat-ui";/
import {ChatFeed, Message} from 'react-chat-ui'
import ChatBox, {ChatFrame} from 'react-chat-plugin'

const styles = {
  button: {
    backgroundColor: '#fff',
    borderColor: '#1D2129',
    borderStyle: 'solid',
    borderRadius: 20,
    borderWidth: 2,
    color: '#1D2129',
    fontSize: 18,
    fontWeight: '300',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    outline: 'none',
  },
  selected: {
    color: '#fff',
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
}

const users = {
  0: 'You',
  Mark: 'Mark',
  2: 'Evan',
}

const customBubble = (props) => (
  <div>
    <p>{`${props.message.senderName} ${props.message.id ? 'says' : 'said'}: ${
      props.message.message
    }`}</p>
  </div>
)

class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [
        new Message({id: 'Mark', message: 'Hey guys!', senderName: 'Mark'}),
        new Message({
          id: 2,
          message: (
            <p>
              <span>11:50:</span>Hey! Evan here. react-chat-ui is pretty dooope.
            </p>
          ),
          senderName: 'Evan',
        }),
      ],
      useCustomBubble: false,
      curr_user: 0,
    }
  }

  onPress(user) {
    this.setState({curr_user: user})
  }

  onMessageSubmit(e) {
    const input = this.message
    e.preventDefault()
    if (!input.value) {
      return false
    }
    this.pushMessage(this.state.curr_user, input.value)
    input.value = ''
    return true
  }

  pushMessage(recipient, message) {
    const prevState = this.state
    const newMessage = new Message({
      id: recipient,
      message,
      senderName: users[recipient],
    })
    prevState.messages.push(newMessage)
    this.setState(this.state)
  }

  render() {
    return (
      <div className='container'>
        <div className='chatfeed-wrapper'>
          <ChatFeed
            className='chat-txt'
            chatBubble={this.state.useCustomBubble && customBubble}
            maxHeight={250}
            messages={this.state.messages} // Boolean: list of message objects
            showSenderName
          >
            <div class='symbol symbol-45px symbol-circle'>
              <img alt='Pic' src='/ldms/media/avatars/bot.png' />
            </div>
          </ChatFeed>
          <div class='d-flex flex-stack py-4' id='message_4'>
            <div class='d-flex'>
              <div class='symbol symbol-45px symbol-circle'>
                <img alt='Pic' src='/ldms/media/avatars/bot.png' />
              </div>
              <div class='ms-5'>
                <p class='fs-5 fw-bolder text-gray-900 mb-2'>
                  System message <span class='sub-txt'>2:02:20 PM</span>
                </p>
                <p class='fs-14'>
                  Completed task "Collect Information" from "Active Directory Account Failed to
                  logon (manual)".
                </p>
                <p class='fs-14'>
                  Completed task "Closed Approved Action" from "Active Directory Account Failed to
                  logon (manual)".
                </p>
              </div>
            </div>
          </div>
          <div className='input-group'>
            <form onSubmit={(e) => this.onMessageSubmit(e)}>
              <input
                ref={(m) => {
                  this.message = m
                }}
                placeholder='Type a message...'
                className='message-input'
              />
            </form>
            <span className='input-group-text'>
              <i className='fas fa-paper-plane'></i>
            </span>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-around'}}></div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}></div>
        </div>
      </div>
    )
  }
}

export default Chat
