import React, {useRef} from 'react'

export default function AddChat(props){
   var chatNameRef = useRef(null),
   buttonRef = useRef(null)
   
   function sendNewChatInfo() {
      props.socket.emit('newChat', {
         chatName: chatNameRef.current.value,
      })
      buttonRef.current.innerHTML = "creating..."
      props.socket.on('newChat',(body)=>{ 
         if (body === 400){
            alert('you already have already created the max of 5 chats')
         }else if (body === 200){
            window.location.reload()
         }else{
            alert('there was an error when creating your chat')
         }
         buttonRef.current.innerHTML = "CREATE"
      })
   }
      return (
         <div
            className="AddChat"
            style={props.style}
         >
            <a type='button' onClick={() => props.toggleAddChat()} />
            <div className="title">Add Chat</div>
            <form
               onSubmit={(event) => {
                  sendNewChatInfo()
                  event.preventDefault()
               }}>
               <input
                  placeholder="Chat Name"
                  maxLength="10"
                  ref={chatNameRef}
                  required
               /><br/>
               <button
                  ref={buttonRef}
                  type="submit"
                  className="Create"
               >
                  CREATE</button>
            </form>
         </div >
      )
}