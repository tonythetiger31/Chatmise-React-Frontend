import React from 'react'
import TextsUi from './mainUi/TextsUi.js'
import ChatMenu from './mainUi/ChatMenu.js'
import TopBar from './mainUi/TopBar.js'
import HamburgerMenu from './mainUi/HamburgerMenu.js'
import Settings from './mainUi/Settings.js'
import css from './App.scss'
import { io } from 'socket.io-client'
import themes from './themes.js'


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
         username: "Loading",
         hamburgerMenuStyle: { display: "none" },
         settingsStyle: { display: "none" }
      }
      this.URL = (() =>{
         if (process.env.NODE_ENV === "development") {
            return "localhost:80/"
         }else{
            return "/"
         }
      })()
      this.changeCurrentChat = this.changeCurrentChat.bind(this)
      this.displayMessage = this.displayMessage.bind(this)
   }
   changeCurrentChat = (arg) => {
      this.setState({
         currentChat: arg
      })
   }
   componentDidMount() {
      this.socket = io(this.URL, {
         withCredentials: true
      })
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
   toggleHamburgerMenu = () => {
      this.setState((prevState) => {
         var style = { display: "none" }
         if (prevState.hamburgerMenuStyle.display === "none") {
            style = { display: "block" }
         }
         return {
            hamburgerMenuStyle: style
         }
      })
   }
   toggleSettings = () => {
      this.setState((prevState) => {
         var style = { display: "none" }
         if (prevState.settingsStyle.display === "none") {
            style = { display: "block" }
         }
         return {
            settingsStyle: style
         }
      })
   }
   changeTheme = (arg) => {
      var keys = Object.keys(themes[arg.target.value]),
         values = Object.values(themes[arg.target.value])
      keys.forEach((element, i) => {
         document.documentElement.style.setProperty(`--${element}`, values[i]);
      })
   }
   render() {
      return (
         <div className="mainUi">
            <div
               className="grayBackground"
               style={this.state.settingsStyle}
            />
            <Settings
               style={this.state.settingsStyle}
               toggleSettings={this.toggleSettings}
               changeTheme={this.changeTheme}
            />
            <ChatMenu
               changeCurrentChat={(arg) => this.changeCurrentChat(arg)}
               data={this.state.chats}
            />
            <div className="rightContainer">
               <TopBar
                  hamburgerMenuStyle={this.state.hamburgerMenuStyle}
                  data={this.state.chats[this.state.currentChat]}
                  toggleHamburgerMenu={this.toggleHamburgerMenu}
               />
               <HamburgerMenu
                  username={this.state.username}
                  style={this.state.hamburgerMenuStyle}
                  toggleSettings={this.toggleSettings}
               />
               <TextsUi
                  sendAndDisplayMessage={(arg) => this.sendAndDisplayMessage(arg)}
                  data={this.state.texts[this.state.currentChat]}
                  username={this.state.username}
               />
            </div>
         </div>
      )
   }
}