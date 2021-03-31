import React from 'react'
import socket from '../socket.js'

export default function YourInvites(props) {

   function acceptInvite(isAccepted, chatId) {
      socket.emit('acceptInvite', {
         "chatId": chatId,
         "isAccepted": isAccepted
      })
      socket.on('acceptInvite', body => {
         if (body !== 200) {
            alert('error', body)
         } else if (isAccepted) {
            alert('success')
            window.location.reload()
         } else if (!isAccepted) {
            updateState()
         }
      })
   function updateState() {
      props.setAppData(prevState => {
         var newInvites = []
         for (var element of prevState.invites) {
            (element._id !== chatId) && newInvites.push()
         }
         return {
            ...prevState,
            'invites': newInvites
         }
      })
   }
}

var invites = props.invites.map((element, i) => {
   console.log(element)
   return (<div className="individualInvite" key={i}>
      {`${element.admin} - ${element.chatName} `}
      <button
         className="accept"
         onClick={() => acceptInvite(true, element._id)}
      >accept</button>
      <button
         className="decline"
         onClick={() => acceptInvite(false, element._id)}
      >decline</button>
   </div>)
})
return (
   <div className="YourInvites">
      <a onClick={() => props.toggle('renYourInvites')} />
      <div className="title">Your Invites</div>
      {invites.length !== 0 ? invites: 
      <div className="noInvites">you have no invites</div>}
   </div>
)
}
