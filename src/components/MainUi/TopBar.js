import React from "react"
import exitSvg from '../../resources/exit.svg'
import hamburgerSvg from '../../resources/hamburger.svg'

export default class TopBar extends React.Component {
   constructor() {
      super()
      this.style = { content: `url(${hamburgerSvg})` }
   }
   conditionalRender() {
      if (this.props.hamburgerMenuStyle.display === "block") {
         this.style = { content: `url(${exitSvg})` }
      } else {
         this.style = { content: `url(${hamburgerSvg})` }
      }
   }
   render() {
      this.conditionalRender()
      return (
         <div className="TopBar">
            <div>{this.props.data}</div>
            <a
               type="button"
               onClick={() => { this.props.action() }}
               style={this.style}
            />
         </div>
      )
   }
}