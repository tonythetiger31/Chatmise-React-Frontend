import React from 'react'

export default function HamburgerMenu(props) {

   const bugReportURL = "https://tipsandbugreport.netlify.app/"
   async function logout() {
      const options = {
         method: 'delete',
      };
      const response = await fetch('/logout', options);
      const json = await response.json();
      window.location.replace("/login")
   }
   const isAdmin = props.username === props.admin
   return (
      <div className="HamburgerMenu">
         <a className="exitButton" onClick={() => props.toggleHamburgerMenu()} />
         <div className="youAreLoggedInAs">Logged in as {props.username} </div>
         {isAdmin &&
            <div>
               <button
                  onClick={() => props.toggle('renInviteMenu')}
               >Invite</button><br />
            </div>}
         <button onClick={() => props.toggle('renChatInfo')} >Chat Info</button><br />
         <button onClick={() => props.toggle('renSettings')} >Settings</button><br />
         <button onClick={() => props.toggle('renYourInvites')}>Your Invites</button><br />
         <button onClick={() => logout()}>Logout</button><br />
         <div className="links">
            <a href="/home">Home</a>
            <pre> | </pre>
            <a href={bugReportURL}>Report Bug</a>
         </div>
      </div>
   )
}