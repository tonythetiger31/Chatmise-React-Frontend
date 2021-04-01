import React, { useRef, useState, useEffect } from 'react'
import socket from '../socket'
import validator from 'validator'

export default function InviteMenu(props) {
   const [message, setMessage] = useState(null)
   const [previousInput, setPreviousInput] = useState(null)
   var input = useRef(null)
   var button = useRef(null)
   const successStyle = {
      backgroundColor: "var(--darkGreenColor)",
      color: "var(--textColor)"
   }
   const loadingStyle = {
      backgroundColor: "var(--bodyColor)",
      color: "var(--textColor)"
   }
   function sendFormData() {
      const invitee = input.current.value
      const isValidConditions = (
         validator.isLength(invitee, { min: 0, max: 10 })
         && validator.isAlphanumeric(invitee)
      )

      const validate = (() => {
         setPreviousInput(prev => {
            (invitee === prev)
               ? setMessage({ text: "already tried that", color: {} })
               : (invitee === props.username)
                  ? setMessage({ text: "can't invite yourself", color: {} })
                  : (isValidConditions)
                     ? sendMessage()
                     : setMessage({ text: "Must be AlphaNumeric", color: {} });

            return invitee
         })
      })()
      function sendMessage() {
         console.log('ran')
         socket.emit('invite', {
            "chatId": props.chatId,
            "invitee": invitee
         })
         setMessage({ text: "Sending...", color: loadingStyle })
         receiveMessage()
      }
      function receiveMessage() {
         socket.on('invite', data => {
            if (data === 200) {
               setMessage({
                  "text": 'Invite Sent!',
                  "color": successStyle
               })
            } else if (data === 404) {
               setMessage({ text: 'user not found', color: {} })
            } else if (data === 409) {
               setMessage({ text: 'user aleady invited', color: {} })
            } else {
               setMessage({ text: "error", color: {} })
            }
         })
      }
   }
   useEffect(() => {
      input.current.focus()
   },[])
   return (
      <div className="InviteMenu">
         <a type='button' onClick={() => props.toggle('renInviteMenu')}></a>
         <div className="title">Invite</div>
         <div className="subTitle">Invite your friends to this chat</div>
         <form className="invite"
            onSubmit={event => {
               event.preventDefault()
               sendFormData()
            }}>
            <input
               ref={input}
               required
               placeholder="Invite somone"
               size="14"
               maxLength="10"
            />
            <button
               type="submit"
               ref={button}
            >Send</button>
         </form>
         {message &&
            <div
               className="message"
               style={message.color}
            >{message.text}</div>}
      </div>
   )
}
