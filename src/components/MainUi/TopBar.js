import React from "react"
export default class TopBar extends React.Component{
   constructor(){
      super()
   }
   render(){
      return(
         <div className="TopBar">
            <div>{this.props.data}</div>
         </div>
      )
   }
}