import React from 'react'
import themes from '../themes.js'

export default function HamburgerMenu(props){
   
      var themeOptions = themes.map((element, i) => {
         return (
            <option value={i} key={i}>{element.name}</option>
         )
      })
      return (
         <div className="Settings" style={props.style} >
            <a type='button' onClick={() => props.toggleSettings()}></a>
            <div className="title">Settings</div>
            <div>Theme</div>
            <select value={props.theme} onChange={props.changeTheme}>
               {themeOptions}
            </select>
         </div>
      )
}