import React from 'react'
import TextsUi from './TextsUi.js'
import ChatMenu from './ChatMenu.js'
import TopBar from './TopBar.js'
import { io } from 'socket.io-client'

export default class MainUi extends React.Component {
   constructor() {
      super()
      this.state = {
         texts: [[{
            "time": 3141592653,
            "text": "Loading...",
            "sender": "Loading..."
         }],],
         chats: ["Loading..."],
         currentChat: 0,
         username: "Loading"
      }
      this.changeCurrentChat = this.changeCurrentChat.bind(this)
      this.displayMessage = this.displayMessage.bind(this)
   }
   changeCurrentChat(arg) {
      this.setState({
         currentChat: arg
      })
   }
   componentDidMount() {
      var connectToWebSocket = (() => {
         var URL = "/"
         if (process.env.NODE_ENV === "development") {
            URL = "localhost:80/"
         }
         this.socket = io(URL, {
            withCredentials: true
         })
      })()
      this.socket.on('allTexts', (body) => {
         if (body !== "invalid credentials") {
            this.setState((_) => {
               return {
                  chats: body.collections,
                  texts: body.data,
                  username: body.username
               }
            })
         } else {
            console.log("ERR Credentials Invalid")
         }
      })
      this.socket.on('text', (body) => {
         this.displayMessage(body)
      })
   }
   displayMessage(message) {
      this.setState((prevState) => {
         var chatToAddTo = this.state.currentChat
         if (message.chat) {
            chatToAddTo = prevState.chats.indexOf(message.chat)
         }
         var newTexts = prevState.texts.map((element, i) => {
            var result = element
            if (i === chatToAddTo) {
               result = element.concat([message])
            }
            return result
         })
         return {
            texts: newTexts
         }
      })
   }
   sendAndDisplayMessage(message) {
      this.displayMessage(message)
      this.socket.emit('texts', {
         text: message.text,
         time: message.time,
         chat: this.state.chats[this.state.currentChat]
      })
   }
   render() {
      return (
         <div className="MainUi">
            <ChatMenu
               action={(arg) => { this.changeCurrentChat(arg) }}
               data={this.state.chats}
            />
            <div className="textsUiAndTopBarContainer">
               <TopBar
                  data={this.state.chats[this.state.currentChat]}
               />
               <TextsUi
                  action={(arg) => { this.sendAndDisplayMessage(arg) }}
                  data={this.state.texts[this.state.currentChat]}
                  username={this.state.username}
               />
            </div>
         </div>
      )
   }
}