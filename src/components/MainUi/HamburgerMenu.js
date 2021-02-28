import React from 'react'

export default class HamburgerMenu extends React.Component {
   constructor() {
      super()
      
   }
   goToBugReportWebsite = () => {
      window.location.replace('https://tipsandbugreport.netlify.app/')
   }
   
   render() {
      return (
         <div className="HamburgerMenu" style={this.props.style}>
            <div className="youAreLoggedInAs">Logged in as {this.props.username} </div>
            <button>Settings</button><br />
            <button>Logout</button><br />
            <button onClick={this.goToBugReportWebsite}>Report Bugs</button>
            <a className="homeLink" href="/home">Home</a>
         </div>
      )
   }
}