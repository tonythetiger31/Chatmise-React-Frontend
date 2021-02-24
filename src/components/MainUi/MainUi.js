import React from 'react'
import TextsUi from './TextsUi.js'
import ChatMenu from './ChatMenu.js'
import data from '../data.js'
export default class MainUi extends React.Component {
   constructor() {
      super()
      this.state = {
         texts: data.texts,
         chats: data.chats,
         currentChat: 0
      }
      this.changeCurrentChat = this.changeCurrentChat.bind(this)
      this.addNewMessageToState = this.addNewMessageToState.bind(this)
   }
   changeCurrentChat(arg) {
      this.setState({
         currentChat: arg
      })
   }
   addNewMessageToState(arg) {
      this.setState((prevState) => {
         var newTexts = prevState.texts.map((element, i) => {
            var result = element
            if (i === this.state.currentChat) {
               console.log('dang')
               result = element.concat([arg])
            }
            return result
         })
         return {
            texts: newTexts
         }
      })
   }
   render() {
      return (
         <div className="MainUi">
            <ChatMenu action={(arg) => { this.changeCurrentChat(arg) }} data={this.state.chats} />
            <TextsUi action={(arg) => { this.addNewMessageToState(arg) }} data={this.state.texts[this.state.currentChat]} />
         </div>
      )
   }
}