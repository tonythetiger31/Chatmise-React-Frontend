import React, { useRef, useEffect } from 'react'
import socket from '../socket'
import validator from 'validator'

export default function CreateChat(props) {
   var chatNameRef = useRef(null),
      buttonRef = useRef(null)

   function success() {
      alert('successfully created')
      window.location.reload()
   }

   function processNewChat() {
      const chatName = chatNameRef.current.value

      const validate = (() => {
         (validator.isAlphanumeric(chatName))
            ? sendNewChatInfo()
            : alert('Chat name must be alphanumeric')
      })()
      function sendNewChatInfo() {
         socket.emit('newChat', {
            "chatName": chatNameRef.current.value
         })
         buttonRef.current.innerHTML = "creating..."
         socket.on('newChat', (body) => {
            (body === 200)
               ? success()
               : (body === 400 || body === 500)
                  ? alert('there was an error when creating your chat')
                  : (body === 403)
                  && alert('you already have already created the max of 5 chats');
            buttonRef.current.innerHTML = "CREATE"
         })
      }
   }
   useEffect(() => {
      chatNameRef.current.focus();
   }, [])
   function stopSpaces(event) {
      if (event.keyCode == 32) {
         event.preventDefault();
      };
   }
   return (
      <div
         className="CreateChat">
         <a type='button' onClick={() => props.toggle('renCreateChat')} />
         <div className="title">Create Chat</div>
         <form
            onSubmit={(event) => {
               processNewChat()
               event.preventDefault()
            }}>
            <input
               placeholder="Chat Name"
               maxLength="10"
               minLength="4"
               ref={chatNameRef}
               required
               size="15"
               onKeyDown={(event) => { stopSpaces(event) }}
            />
            <button
               ref={buttonRef}
               type="submit"
               className="Create"
            >Create</button>
         </form>
      </div >
   )
}