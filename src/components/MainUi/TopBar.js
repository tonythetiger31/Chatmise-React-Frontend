import React from "react"
import exitSvg from '../../resources/exit.svg'
import hamburgerSvg from '../../resources/hamburger.svg'

export default function TopBar(props) {
   var style = { content: `url(${hamburgerSvg})` }
   const conditionalRender = (() => {
      if (props.hamburgerMenuStyle.display === "block") {
         style = { content: `url(${exitSvg})` }
      } else {
         style = { content: `url(${hamburgerSvg})` }
      }
   })()
   return (
      <div className="TopBar" style={props.style}>
         <a className="chatButton" onClick={() => props.toggleChatMenu()} />
         <div>{props.data}</div>
         <a
            className="hamburgerButton"
            type="button"
            onClick={() => { props.toggleHamburgerMenu() }}
            style={style}
         />
      </div>
   )
}