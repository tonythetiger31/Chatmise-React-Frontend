import React from 'react'
export default function ChatMenu(props) {

   const mapedChats = props.data.map((element, i) => {
      return (
         <div
            className="individualChat"
            onClick={() => { props.changeCurrentChat(i) }}
            key={i}
         >
            {element}
         </div>
      )
   })
   return (
      <div className="ChatMenu" style={props.style}>
         <div className="topBar">
            <a
               className='exitButton'
               onClick={() => props.toggleChatMenu()}
            />
               Chats
            </div>
         <div className="chats">
            {mapedChats}
         </div>
         <button
            className="addChatButton"
            onClick={() => props.toggleAddChat()}
         >+</button>
      </div>
   )
}