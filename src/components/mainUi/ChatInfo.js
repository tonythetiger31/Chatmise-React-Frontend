import React from 'react'

export default function ChatInfo(props) {
   var members = props.members.map((element, i) => {
      return (
         <div className="members" key={i}>
            {element} <br />
         </div>
      )
   })
   return (
      <div className="ChatInfo">
         <a type='button' onClick={() => props.toggle('renChatInfo')}></a>
         <div className="title">Current Chat Info</div>
         <div className="subTitle">admin</div>
         {props.admin}
         <div className="subTitle">members</div>
         {members}
      </div>
   )
}