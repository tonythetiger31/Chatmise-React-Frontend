import React from 'react'

export default class HamburgerMenu extends React.Component {
   constructor() {
      super()
   }
   goToBugReportWebsite = () => {
      window.location.replace('https://tipsandbugreport.netlify.app/')
   }
   async logout() {
      const options = {
          method: 'delete',
      };
      const response = await fetch('/logout', options);
      const json = await response.json();
      window.location.replace("/login")
  }
   render() {
      return (
         <div className="HamburgerMenu" style={this.props.style}>
            <a className="exitButton" onClick={() => this.props.toggleHamburgerMenu()}/>
            <div className="youAreLoggedInAs">Logged in as {this.props.username} </div>
            <button onClick={() => this.props.toggleSettings()} >Settings</button><br />
            <button onClick={() => this.logout()}>Logout</button><br />
            <button onClick={this.goToBugReportWebsite}>Report Bugs</button>
            <a className="homeLink" href="/home">Home</a>
         </div>
      ) 
   }
}