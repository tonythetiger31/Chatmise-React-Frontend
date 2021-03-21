//dependencies
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import socket from './socket.js'
//components
import TextsUi from './mainUi/TextsUi.js'
import ChatMenu from './mainUi/ChatMenu.js'
import TopBar from './mainUi/TopBar.js'
import HamburgerMenu from './mainUi/HamburgerMenu.js'
import Settings from './mainUi/Settings.js'
import AddChat from './mainUi/AddChat.js'
import ChatInfo from './mainUi/ChatInfo'
//other files
import css from './App.scss'
import themes from './themes.js'
import ping from '../resources/ping.mp3'

export default function MainUi() {
   const [chatInfo, setChatInfo] = useState({
      texts: [[{
         "time": 3141592653,
         "text": "Loading...",
         "sender": "Loading..."
      }],],
      chatNames: ["Loading..."],
      chatIds: ["Loading..."],
      username: "Loading",
   })
   const [componentStyle, setComponentStyle] = useState({
      hamburgerMenuStyle: { display: "none" },
      settingsStyle: { display: "none" },
      internetWarningPopUpStyle: { display: "none" },
      grayBackgroundStyle: { display: "none" },
      chatMenuStyle: { display: "block" },
      addChatStyle: { display: "none" },
      rightContainerStyle: {},
      topBarStyle: {},
      textUiStyle: {}
   })
   const [currentChat, setCurrentChat] = useState(0)
   const [theme, setTheme] = useState(1)
   const audio = new Audio(ping),
      isMobile = window.screen.width <= 760

   useEffect(() => {
      window.screen.orientation.addEventListener("change", orientation => {
         if (window.screen.orientation.angle !== 0) {
            alert("this app works best in portrait mode")
         }
      });

      socket.on('allTexts', (body) => {
         if (body !== "invalid credentials") {
            setChatInfo({
               chatIds: body.chatIds,
               chatNames: body.chatNames,
               texts: body.data,
               username: body.username
            })
            changeTheme(body.settings)
         } else {
            console.log("ERR Credentials Invalid")
         }
      })
      socket.on('text', (body) => {
         displayMessage(body)
         if (document.visibilityState !== 'visible') {
            audio.play()
         }
      })
      socket.on('disconnect', () => {
         setComponentStyle({
            ...componentStyle,
            internetWarningPopUpStyle: { display: "block" },
            grayBackgroundStyle: { display: "block" }
         })
         window.location.reload();
      })
   }, [])

   function sendAndDisplayMessage(message) {
      displayMessage(message)
      console.log(currentChat)
      socket.emit('texts', {
         text: message.text,
         time: message.time,
         chat: chatInfo.chatIds[currentChat]
      })
   }
   //style functions
   const hideNewChatMenu = () => {
      setComponentStyle({
         ...componentStyle,
         addChatStyle: { display: "none" },
         grayBackgroundStyle: { display: "none" }
      })
   }
   const changeCurrentChat = (arg) => {
      if (window.screen.width <= 760) {
         setComponentStyle({
            ...componentStyle,
            chatMenuStyle: { display: "none" },
            rightContainerStyle: { display: "block" }
         })
      }
      setCurrentChat(arg)
   }
   function displayMessage(message) {
      setChatInfo(prevState => {
         var chatToAddTo = currentChat
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
         console.log(newTexts)
         return {
            ...chatInfo,
            texts: newTexts
         }
      })
   }
   const changeTheme = (arg) => {
      try {
         var value = arg.target.value
         socket.emit('settings', {
            settings: value
         })
      } catch (err) {
         var value = arg
      }
      var keys = Object.keys(themes[value]),
         values = Object.values(themes[value])
      setTheme(value)
      keys.forEach((element, i) => {
         document.documentElement.style.setProperty(`--${element}`, values[i]);
      })
   }
   //toggle functions
   const toggleHamburgerMenu = () => {
      setComponentStyle(prevState => {
         var block = { display: "block" }
         var none = { display: "none" }
         var hamburgerMenuWasClosed = prevState.hamburgerMenuStyle.display === "none"
         var style = {
            ...componentStyle,
            hamburgerMenuStyle: none,
            rightContainerStyle: block,
            chatmenuStyle: block
         }
         if (isMobile) {
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
         return style
      })
   }
   const toggleSettings = () => {
      setComponentStyle(prevState => {
         var style = { display: "none" }
         if (prevState.settingsStyle.display === "none") {
            style = { display: "block" }
         }
         return {
            ...componentStyle,
            settingsStyle: style,
            grayBackgroundStyle: style
         }
      })
   }
   const toggleChatMenu = () => {
      setComponentStyle(prevState => {
         var style = {
            ...componentStyle,
            chatMenuStyle: { display: "block" },
            rightContainerStyle: { display: "none" }
         }
         if (prevState.chatMenuStyle.display === "block") {
            style = {
               ...componentStyle,
               chatMenuStyle: { display: "none" },
               rightContainerStyle: { display: "block" }
            }
         }
         return style
      })
   }
   const toggleAddChat = () => {
      setComponentStyle(prevState => {
         var style = {
            ...componentStyle,
            addChatStyle: { display: "block" },
            grayBackgroundStyle: { display: "block" }
         }
         if (prevState.addChatStyle.display === "block") {
            style = {
               ...componentStyle,
               addChatStyle: { display: "none" },
               grayBackgroundStyle: { display: "none" }
            }
         }
         return style
      })
   }
   return (
      <div className="mainUi"
      >
         <div
            className="internetWarningPopUp"
            style={componentStyle.internetWarningPopUpStyle}
         >Connection error, please check your internet</div>
         <div
            className="grayBackground"
            style={componentStyle.grayBackgroundStyle}
         />
         <Settings
            style={componentStyle.settingsStyle}
            toggleSettings={toggleSettings}
            changeTheme={changeTheme}
            theme={theme}
         />
         <AddChat
            hideNewChatMenu={_ => hideNewChatMenu()}
            style={componentStyle.addChatStyle}
            toggleAddChat={toggleAddChat}
            socket={socket}
         />
         <ChatMenu
            changeCurrentChat={(arg) => changeCurrentChat(arg)}
            data={chatInfo.chatNames}
            style={componentStyle.chatMenuStyle}
            toggleChatMenu={toggleChatMenu}
            toggleAddChat={toggleAddChat}
         />
         <div
            className="rightContainer"
            style={componentStyle.rightContainerStyle}
         >
            <TopBar
               style={componentStyle.topBarStyle}
               hamburgerMenuStyle={componentStyle.hamburgerMenuStyle}
               data={chatInfo.chatNames[currentChat]}
               toggleHamburgerMenu={toggleHamburgerMenu}
               toggleChatMenu={toggleChatMenu}
            />
            <HamburgerMenu
               username={chatInfo.username}
               style={componentStyle.hamburgerMenuStyle}
               toggleSettings={toggleSettings}
               toggleHamburgerMenu={toggleHamburgerMenu}
            />
            <TextsUi
               style={componentStyle.textUiStyle}
               sendAndDisplayMessage={(arg) => sendAndDisplayMessage(arg)}
               data={chatInfo.texts[currentChat]}
               username={chatInfo.username}
            />
         </div>
      </div>
   )

}