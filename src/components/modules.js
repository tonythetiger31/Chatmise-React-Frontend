import React, { useState } from 'react'

function useRender() {
   var isMobile = window.screen.width <= 760 && window.screen.orientation.angle === 0
   const [render, setRender] = useState({
      renHamburgerMenu: false,
      renSettings: false,
      renInternetWarning: false,
      renGrayBackground: false,
      renChatMenu: true,
      renCreateChat: false,
      renRightContainer: isMobile ? false : true,
      renTobBar: true,
      renTextUi: true,
      renChatInfo: false,
      renInviteMenu: false,
      renYourInvites: false
   })
   const toggleHamburgerMenu = () => {
      setRender(prevState => {
         var bools = {
            ...render,
            renHamburgerMenu: false,
            renRightContainer: true,
            renChatMenu: true
         }
         if (isMobile) {
            if (!prevState.renHamburgerMenu) {
               bools.renTextUi = false
               bools.renChatMenu = false
               bools.renHamburgerMenu = true
               bools.renTobBar = false
            } else {
               bools.renChatMenu = false
               bools.renRightContainer = true
               bools.renTobBar = true
               bools.renTextUi = true
            }
         } else {
            if (!prevState.renHamburgerMenu) {
               bools.renHamburgerMenu = true
            }
         }
         return bools
      })
   }
   function toggleComponentRender(component){
      setRender(prevState => {
         return {
            ...render,
            [component]: !prevState[component],
            renGrayBackground: !prevState[component]
         }
      })
   }
   const toggleChatMenu = () => {
      setRender(prevState => {
         return {
            ...render,
            renChatMenu: !prevState.renChatMenu,
            renRightContainer: prevState.renChatMenu
         }
      })
   }
   return [
      render, setRender, toggleHamburgerMenu,
       toggleChatMenu, toggleComponentRender
   ]
}

export { useRender }