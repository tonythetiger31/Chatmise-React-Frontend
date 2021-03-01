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
         <div className="ChatMenu">
            {mapedChats}
         </div>
      )
   }
}