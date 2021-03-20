//dependencies
import React from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'
//components
import TextsUi from './mainUi/TextsUi.js'
import ChatMenu from './mainUi/ChatMenu.js'
import TopBar from './mainUi/TopBar.js'
import HamburgerMenu from './mainUi/HamburgerMenu.js'
import Settings from './mainUi/Settings.js'
import AddChat from './mainUi/AddChat.js'
//other files
import css from './App.scss'
import themes from './themes.js'
import ping from '../resources/ping.mp3'

export default class MainUi extends React.Component {
   constructor() {
      super()
      this.state = {
         texts: [[{
            "time": 3141592653,
            "text": "Loading...",
            "sender": "Loading..."
         }],],
         chatNames: ["Loading..."],
         chatIds: ["Loading..."],
         currentChat: 0,
         username: "Loading",
         theme: 0,
         hamburgerMenuStyle: { display: "none" },
         settingsStyle: { display: "none" },
         internetWarningPopUpStyle: { display: "none" },
         grayBackgroundStyle: { display: "none" },
         chatMenuStyle: { display: "block" },
         addChatStyle: { display: "none" },
         rightContainerStyle: {},
         topBarStyle: {},
         textUiStyle: {}
      }
      this.URL = (() => {
         if (process.env.NODE_ENV === "development") {
            return "http://localhost:8080/"
         } else {
            return "/"
         }
      })()
      this.righContainer = React.createRef()
      this.changeCurrentChat = this.changeCurrentChat.bind(this)
      this.displayMessage = this.displayMessage.bind(this)
      this.audio = new Audio(ping)
      this.isMobile = window.screen.width <= 760
   }
   //socket functions
   componentDidMount() {
      window.screen.orientation.addEventListener("change", orientation => {
         if (window.screen.orientation.angle !== 0) {
            alert("this app works best in portrait mode")
         }
      });
      this.socket = io(this.URL, {
         withCredentials: true
      })
      this.socket.on('allTexts', (body) => {
         if (body !== "invalid credentials") {
            this.setState((_) => {
               return {
                  chatIds: body.chatIds,
                  chatNames: body.chatNames,
                  texts: body.data,
                  username: body.username
               }
            })
            this.changeTheme(body.settings)
         } else {
            console.log("ERR Credentials Invalid")
         }
      })
      this.socket.on('text', (body) => {
         this.displayMessage(body)
         if (document.visibilityState !== 'visible') {
            this.audio.play()
         }
      })
      this.socket.on('disconnect', () => {
         this.setState((_) => {
            return {
               internetWarningPopUpStyle: { display: "block" },
               grayBackgroundStyle: { display: "block" }
            }
         })
         window.location.reload();
      })
   }
   sendAndDisplayMessage(message) {
      this.displayMessage(message)
      this.socket.emit('texts', {
         text: message.text,
         time: message.time,
         chat: this.state.chatIds[this.state.currentChat]
      })
   }
   //style functions
   hideNewChatMenu = () => {
      this.setState({
         addChatStyle: { display: "none" },
         grayBackgroundStyle: { display: "none" }
      })
   }
   changeCurrentChat = (arg) => {
      var style = {
         currentChat: arg
      }
      if (window.screen.width <= 760) {
         style.chatMenuStyle = { display: "none" }
         style.rightContainerStyle = { display: "block" }
      }
      this.setState(style)
   }
   displayMessage(message) {
      this.setState((prevState) => {
         var chatToAddTo = this.state.currentChat
         if (message.chat) {
            chatToAddTo = prevState.chatIds.indexOf(message.chat)
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
   changeTheme = (arg) => {
      try {
         var value = arg.target.value
         this.socket.emit('settings', {
            settings: value
         })
      } catch (err) {
         var value = arg
      }
      var keys = Object.keys(themes[value]),
         values = Object.values(themes[value])
      this.setState((_) => {
         return {
            theme: value
         }
      })
      keys.forEach((element, i) => {
         document.documentElement.style.setProperty(`--${element}`, values[i]);
      })
   }
   //toggle functions
   toggleHamburgerMenu = () => {
      this.setState((prevState) => {
         var block = { display: "block" }
         var none = { display: "none" }
         var hamburgerMenuWasClosed = prevState.hamburgerMenuStyle.display === "none"
         var style = {
            hamburgerMenuStyle: none,
            rightContainerStyle: block,
            chatmenuStyle: block
         }
         if (this.isMobile) {
            if (hamburgerMenuWasClosed) {
               style.textUiStyle = none
               style.topBarStyle = none
               style.chatmenuStyle = none
               style.hamburgerMenuStyle = block
            } else {
               style.chatmenuStyle = none
               style.topBarStyle = block
               style.textUiStyle = block
            }
         } else {
            if (hamburgerMenuWasClosed) {
               style.hamburgerMenuStyle = block
            }
         }
         console.log(style)
         return style
      })
   }
   toggleSettings = () => {
      this.setState((prevState) => {
         var style = { display: "none" }
         if (prevState.settingsStyle.display === "none") {
            style = { display: "block" }
         }
         return {
            settingsStyle: style,
            grayBackgroundStyle: style
         }
      })
   }
   toggleChatMenu = () => {
      this.setState((prevState) => {
         var style = {
            chatMenuStyle: { display: "block" },
            rightContainerStyle: { display: "none" }
         }
         if (prevState.chatMenuStyle.display === "block") {
            style = {
               chatMenuStyle: { display: "none" },
               rightContainerStyle: { display: "block" }
            }
         }
         return style
      })
   }
   toggleAddChat = () => {
      this.setState((prevState) => {
         var style = {
            addChatStyle: { display: "block" },
            grayBackgroundStyle: { display: "block" }
         }
         if (prevState.addChatStyle.display === "block") {
            style = {
               addChatStyle: { display: "none" },
               grayBackgroundStyle: { display: "none" }
            }
         }
         return style
      })
   }
   render() {
      return (
         <div className="mainUi"
            ref={this.righContainer}
         >
            <div
               className="internetWarningPopUp"
               style={this.state.internetWarningPopUpStyle}
            >Connection error, please check your internet</div>
            <div
               className="grayBackground"
               style={this.state.grayBackgroundStyle}
            />
            <Settings
               style={this.state.settingsStyle}
               toggleSettings={this.toggleSettings}
               changeTheme={this.changeTheme}
               theme={this.state.theme}
            />
            <AddChat
               hideNewChatMenu={_=>this.hideNewChatMenu()}
               style={this.state.addChatStyle}
               toggleAddChat={this.toggleAddChat}
               socket={this.socket}
            />
            <ChatMenu
               changeCurrentChat={(arg) => this.changeCurrentChat(arg)}
               data={this.state.chatNames}
               style={this.state.chatMenuStyle}
               toggleChatMenu={this.toggleChatMenu}
               toggleAddChat={this.toggleAddChat}
            />
            <div
               className="rightContainer"
               style={this.state.rightContainerStyle}
            >
               <TopBar
                  style={this.state.topBarStyle}
                  hamburgerMenuStyle={this.state.hamburgerMenuStyle}
                  data={this.state.chatNames[this.state.currentChat]}
                  toggleHamburgerMenu={this.toggleHamburgerMenu}
                  toggleChatMenu={this.toggleChatMenu}
               />
               <HamburgerMenu
                  username={this.state.username}
                  style={this.state.hamburgerMenuStyle}
                  toggleSettings={this.toggleSettings}
                  toggleHamburgerMenu={this.toggleHamburgerMenu}
               />
               <TextsUi
                  style={this.state.textUiStyle}
                  sendAndDisplayMessage={(arg) => this.sendAndDisplayMessage(arg)}
                  data={this.state.texts[this.state.currentChat]}
                  username={this.state.username}
               />
            </div>
         </div>
      )
   }
}