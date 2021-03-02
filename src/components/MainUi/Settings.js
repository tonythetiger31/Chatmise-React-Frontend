import React from 'react'
import themes from '../themes.js'

export default class HamburgerMenu extends React.Component {
   constructor() {
      super()
   }
   render() {
      var themeOptions = themes.map((element, i) => {
         return (
            <option value={i} key={i}>{element.name}</option>
         )
      })
      return (
         <div className="Settings" style={this.props.style} >
            <a type='button' onClick={() => this.props.toggleSettings()}></a>
            <div className="title">Settings</div>
            <div>Theme</div>
            <select value={this.props.theme} onChange={this.props.changeTheme}>
               {themeOptions}
            </select>
         </div>
      )
   }
}