import React from 'react'

export default function HamburgerMenu(props) {

   const goToBugReportWebsite = () => {
      window.location.replace('https://tipsandbugreport.netlify.app/')
   }
   async function logout() {
      const options = {
          method: 'delete',
      };
      const response = await fetch('/logout', options);
      const json = await response.json();
      window.location.replace("/login")
  }
      return (
         <div className="HamburgerMenu">
            <a className="exitButton" onClick={() => props.toggleHamburgerMenu()}/>
            <div className="youAreLoggedInAs">Logged in as {props.username} </div>
            <button onClick={() => props.toggleSettings()} >Chat Info</button><br />
            <button onClick={() => props.toggleSettings()} >Settings</button><br />
            <button onClick={() => logout()}>Logout</button><br />
            <button onClick={goToBugReportWebsite}>Report Bugs</button>
            <a className="homeLink" href="/home">Home</a>
         </div>
      ) 
}