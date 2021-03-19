import React from 'react'
export default class AddChat extends React.Component {
   constructor() {
      super()
      this.chatName = React.createRef()
      this.invites = React.createRef()
   }
   sendInfo() {

      this.props.socket.emit('newChat', {
         chatName: this.chatName.current.value,
         invites: this.invites.current.value
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
                  this.sendInfo()
                  event.preventDefault()
               }}>
               <input
                  placeholder="Chat Name"
                  ref={this.chatName}
                  required
               />
               <input
                  ref={this.invites}
                  placeholder="Invites"
               /><br />
               <button
                  type="submit"
                  className="Create"
               >
                  CREATE</button>
            </form>
         </div >
      )
   }
}