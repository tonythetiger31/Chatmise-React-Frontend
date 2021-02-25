import React from 'react'
import TextsUi from './TextsUi.js'
import ChatMenu from './ChatMenu.js'
import TopBar from './TopBar.js'
import { io } from "socket.io-client"

var URL = "/"
if (process.env.NODE_ENV === "development") {
URL = "localhost:80/"
}
var socket = io(URL, {
   withCredentials: true
})
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
         user: "Loading"
      }
      this.changeCurrentChat = this.changeCurrentChat.bind(this)
      this.addNewMessageToState = this.addNewMessageToState.bind(this)
   }
   componentDidMount() {
      socket.on('allTexts', (body) => {
         if (body !== "invalid credentials") {
            this.setState((_) => {
               return {
                  chats: body.collections,
                  texts: body.data,
                  user: body.username
               }
            })
         } else {
            console.log("ERR Credentials Invalid")
         }
      })
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
               result = element.concat([arg])
            }
            return result
         })
         return {
            texts: newTexts
         }
      })
      socket.emit('texts', {
         text: arg.text,
         time: 1612501270210,
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
                  action={(arg) => { this.addNewMessageToState(arg) }}
                  data={this.state.texts[this.state.currentChat]}
                  username={this.state.user}
               />
            </div>
         </div>
      )
   }
}