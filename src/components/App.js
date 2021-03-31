//dependencies
import React, { useEffect, useState } from 'react'
import socket from './socket.js'
//components
import TextsUi from './mainUi/TextsUi.js'
import ChatMenu from './mainUi/ChatMenu.js'
import TopBar from './mainUi/TopBar.js'
import HamburgerMenu from './mainUi/HamburgerMenu.js'
import Settings from './mainUi/Settings.js'
import CreateChat from './mainUi/CreateChat.js'
import ChatInfo from './mainUi/ChatInfo'
import InviteMenu from './mainUi/InviteMenu.js'
import YourInvites from './mainUi/YourInvites.js'

//other files
import css from '../scss/App.scss'
import themes from './themes.js'
import ping from '../resources/ping.mp3'
import * as modules from './modules.js'

export default function MainUi() {
   const [appData, setAppData] = useState({
      texts: [[{
         "time": 0,
         "text": "Loading...",
         "sender": "Loading..."
      }],],
      chatNames: ["Loading..."],
      chatIds: ["Loading..."],
      username: "Loading",
      admins: ["Loading..."],
      members: ["Loading..."],
      invites: ["Loading..."]
   })
   const [
      render, setRender, toggleHamburgerMenu
      , toggleChatMenu, toggleComponent, exitPopUp
   ] = modules.useRender()
   const [currentChat, setCurrentChat] = useState(0)
   const [theme, setTheme] = useState(1)
   const audio = new Audio(ping)

   useEffect(() => {
      socket.on('allTexts', (body) => {
         if (body !== "invalid credentials") {
            setAppData(body)
            changeTheme(body.settings)
         } else {
            console.log("ERR Credentials Invalid")
         }
      })
      socket.on('texts', (body) => {
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
         "text": message.text,
         "time": message.time,
         "chatId": appData.chatIds[currentChat]
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
      setAppData(prevState => {
         var chatToAddTo = currentChat
         if (message.chatId) {
            chatToAddTo = prevState.chatIds.indexOf(message.chatId)
         }
         console.log({ chatToAddTo, message })
         var newTexts = prevState.texts.map((element, i) => {
            var result = element
            if (i === chatToAddTo) {
               result = element.concat([message])
            }
            return result
         })
         console.log({ newTexts }, prevState.texts)
         return {
            ...prevState,
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
            <div
               className="grayBackground"
               onClick={() => exitPopUp()}
            />}
         {render.renSettings &&
            <Settings
               toggle={toggleComponent}
               changeTheme={changeTheme}
               theme={theme}
            />}
         {render.renChatInfo &&
            <ChatInfo
               toggle={toggleComponent}
               admin={appData.admins[currentChat]}
               members={appData.members[currentChat]}
               username={appData.username}
            />}

         {render.renCreateChat &&
            <CreateChat
               toggle={toggleComponent}
            />}

         {render.renInviteMenu &&
            <InviteMenu
               toggle={toggleComponent}
               chatId={appData.chatIds[currentChat]}
               username={appData.username}
               chatName={appData.chatNames[currentChat]}
               username={appData.username}
            />}

         {render.renChatMenu &&
            <ChatMenu
               changeCurrentChat={(arg) => changeCurrentChat(arg)}
               data={appData.chatNames}
               toggleChatMenu={toggleChatMenu}
               toggle={toggleComponent}
            />}

         {render.renYourInvites &&
            <YourInvites
               toggle={toggleComponent}
               invites={appData.invites}
               setAppData={setAppData}
            />}

         {render.renRightContainer &&
            <div className="rightContainer">
               {render.renTobBar &&
                  <TopBar
                     renHamburgerMenu={render.renHamburgerMenu}
                     data={appData.chatNames[currentChat]}
                     toggleHamburgerMenu={toggleHamburgerMenu}
                     toggleChatMenu={toggleChatMenu}
                  />}
               {render.renHamburgerMenu &&
                  <HamburgerMenu
                     username={appData.username}
                     admin={appData.admins[currentChat]}
                     toggle={toggleComponent}
                     toggleHamburgerMenu={toggleHamburgerMenu}
                  />}
               {render.renTextUi &&
                  <TextsUi
                     sendAndDisplayMessage={(arg) => sendAndDisplayMessage(arg)}
                     data={appData.texts[currentChat]}
                     username={appData.username}
                  />}
            </div>}
      </div >
   )
}