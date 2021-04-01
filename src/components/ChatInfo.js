export default function ChatInfo(props) {
   var members = props.members.map((element, i) => {
      return (
         <div className="members" key={i}>
            {element === props.username ? "You" : element} <br />
         </div>
      )
   })

   const isChatAdmin = props.username === props.admin
   return (
      <div className="ChatInfo">
         <a type='button' onClick={() => props.toggle('renChatInfo')}></a>
         <div className="title">Chat Info</div>
         <div className="subTitle">admin: 
            <span className="adminInfo">
               {isChatAdmin ? "You" : props.admin}
            </span>
         </div>
         <div className="subTitle">members</div>
         <div className="info">{members}</div>
      </div>
   )
}