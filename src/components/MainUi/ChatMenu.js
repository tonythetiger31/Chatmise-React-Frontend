import React from 'react'
export default class ChatMenu extends React.Component {
   constructor() {
      super()
   }
   render() {
      const mapedChats = this.props.data.map((element, i) => {
         return (
            <div
               className="individualChat"
               onClick={() => { this.props.changeCurrentChat(i) }}
               key={i}
            >
               {element}
            </div>
         )
      })
      return (
         <div className="ChatMenu" style={this.props.style}>
            <div className="topBar">
               <a
                  className='exitButton'
                  onClick={() => this.props.toggleChatMenu()}
               />
               Chats
            </div>
            <div className="chats">
               {mapedChats}
            </div>
            <button
               className="addChatButton"
               onClick={() => this.props.toggleAddChat()}
            >+</button>
         </div>
      )
   }
}