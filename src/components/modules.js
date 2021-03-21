import React, { useState } from 'react'

function useRender() {
   var isMobile = window.screen.width <= 760 && window.screen.orientation.angle === 0
   const [render, setRender] = useState({
      renHamburgerMenu: false,
      renSettings: false,
      renInternetWarning: false,
      renGrayBackground: false,
      renChatMenu: true,
      renAddChat: false,
      renRightContainer: isMobile ? false : true,
      renTobBar: true,
      renTextUi: true
   })
   const toggleHamburgerMenu = () => {
      setRender(prevState => {
         var hamburgerMenuWasClosed = prevState.renHamburgerMenu === false
         var style = {
            ...render,
            renHamburgerMenu: false,
            renRightContainer: true,
            renChatMenu: true
         }
         if (isMobile) {
            if (hamburgerMenuWasClosed) {
               style.renTextUi = false
               style.renChatMenu = false
               style.renHamburgerMenu = true
               style.renTobBar = false
            } else {
               style.renChatMenu = false
               style.renRightContainer = true
               style.renTobBar = true
               style.renTextUi = true
            }
         } else {
            if (hamburgerMenuWasClosed) {
               style.renHamburgerMenu = true
            }
         }
         return style
      })
   }
   function toggleSettings() {
      setRender(prevState => {
         var style = false
         if (prevState.renSettings === false) {
            style = true
         }
         return {
            ...render,
            renSettings: style,
            renGrayBackground: style
         }
      })
   }
   const toggleChatMenu = () => {
      setRender(prevState => {
         var style = {
            ...render,
            renChatMenu: true,
            renRightContainer: false
         }
         if (prevState.renChatMenu) {
            style = {
               ...render,
               renChatMenu: false,
               renRightContainer: true
            }
         }
         return style
      })
   }
   const toggleAddChat = () => {
      setRender(prevState => {
         var style = {
            ...render,
            renAddChat: true,
            renGrayBackground: true
         }
         if (prevState.renAddChat === true) {
            style = {
               ...render,
               renAddChat: false,
               renGrayBackground: false
            }
         }
         return style
      })
   }

   return [
      render, setRender, toggleHamburgerMenu,
      toggleSettings, toggleChatMenu, toggleAddChat
   ]
}

export { useRender }