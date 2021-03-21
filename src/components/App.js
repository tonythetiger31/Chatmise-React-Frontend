//dependencies
import React, { Component, useEffect, useState } from 'react'
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
import * as modules from './modules.js'

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
   const [
      render, setRender, toggleHamburgerMenu,
      toggleSettings, toggleChatMenu, toggleAddChat
   ] = modules.useRender()
   const [currentChat, setCurrentChat] = useState(0)
   const [theme, setTheme] = useState(1)
   const audio = new Audio(ping)

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
         setRender({
            ...render,
            renInternetWarning: true,
            renGrayBackground: true
         })
         window.location.reload();
      })
   }, [])

   function sendAndDisplayMessage(message) {
      displayMessage(message)
      socket.emit('texts', {
         text: message.text,
         time: message.time,
         chat: chatInfo.chatIds[currentChat]
      })
   }
   //style functions
   const changeCurrentChat = (arg) => {
      if (window.screen.width <= 760) {
         setRender({
            ...render,
            renChatMenu: false,
            renRightContainer: true
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
   return (
      <div className="mainUi">
         {render.renInternetWarning &&
            <div className="internetWarningPopUp" >
               Connection error, please check your internet
            </div>}
         {render.renGrayBackground &&
            <div className="grayBackground" />}
         {render.renSettings &&
            <Settings
               toggleSettings={toggleSettings}
               changeTheme={changeTheme}
               theme={theme}
            />}

         <ChatInfo />

         {render.renAddChat &&
            <AddChat
               toggleAddChat={toggleAddChat}
               socket={socket}
            />}
         {render.renChatMenu &&
            <ChatMenu
               changeCurrentChat={(arg) => changeCurrentChat(arg)}
               data={chatInfo.chatNames}
               toggleChatMenu={toggleChatMenu}
               toggleAddChat={toggleAddChat}
            />}

         {render.renRightContainer &&
            <div className="rightContainer">
               {render.renTobBar &&
                  <TopBar
                     renHamburgerMenu={render.renHamburgerMenu}
                     data={chatInfo.chatNames[currentChat]}
                     toggleHamburgerMenu={toggleHamburgerMenu}
                     toggleChatMenu={toggleChatMenu}
                  />}
               {render.renHamburgerMenu &&
                  <HamburgerMenu
                     username={chatInfo.username}
                     toggleSettings={toggleSettings}
                     toggleHamburgerMenu={toggleHamburgerMenu}
                  />}
               {render.renTextUi &&
                  <TextsUi
                     sendAndDisplayMessage={(arg) => sendAndDisplayMessage(arg)}
                     data={chatInfo.texts[currentChat]}
                     username={chatInfo.username}
                  />}
            </div>}
      </div >
   )
}