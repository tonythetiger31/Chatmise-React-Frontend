import React from 'react'
export default class AddChat extends React.Component {
   constructor() {
      super()
      this.chatName = React.createRef()
      this.button = React.createRef()
   }
   sendNewChatInfo() {
      this.props.socket.emit('newChat', {
         chatName: this.chatName.current.value,
      })
      this.button.current.innerHTML = "creating..."
      this.props.socket.on('newChat',(body)=>{ 
         if (body === 400){
            alert('you already have already created the max of 5 chats')
         }else if (body === 200){
            window.location.reload()
         }else{
            alert('there was an error when creating your chat')
         }
         this.button.current.innerHTML = "CREATE"
      })
   }
   render() {
      return (
         <div
            className="AddChat"
            style={this.props.style}
         >
            <a type='button' onClick={() => this.props.toggleAddChat()} />
            <div className="title">Add Chat</div>
            <form
               onSubmit={(event) => {
                  this.sendNewChatInfo()
                  event.preventDefault()
               }}>
               <input
                  placeholder="Chat Name"
                  maxLength="10"
                  ref={this.chatName}
                  required
               /><br/>
               <button
                  ref={this.button}
                  type="submit"
                  className="Create"
               >
                  CREATE</button>
            </form>
         </div >
      )
   }
}