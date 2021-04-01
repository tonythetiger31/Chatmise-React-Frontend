import React, { useRef, useEffect } from 'react'
import validator from 'validator'
export default function TextsUi(props) {
   var textInputRef = useRef(null),
      messageViewRef = useRef(null)
   var oldProps = {}

   useEffect(() => {
      oldProps = props.data
      messageViewRef.current.lastChild.scrollIntoView();
      textInputRef.current.focus()
   }, [])
   useEffect(() => {
      if (props.data !== oldProps &&
         props.data[0] === oldProps[0]
      ) {//newProps
         console.log('it worked!')
         oldProps = props.data
         if (window.screen.width > 760) {
            messageViewRef.current.lastChild.scrollIntoView({ behavior: "smooth" });
         } else {
            messageViewRef.current.lastChild.scrollIntoView();
         }
      } else {//sameProps
         messageViewRef.current.lastChild.scrollIntoView();
      }
   }, [props])

   function handleNewMessage() {
      const checkIfInputIsEmpty = () => {
         (textInputRef.current.value === "")
            ? textInputRef.current.placeholder = "that was an empty message :("
            : (validator.contains(textInputRef.current.value, '\\'))
               ? alert('please don\'t use backslashes')
               : sendMessage()
      }
      const sendMessage = () => {
         textInputRef.current.focus()
         var params = {
            text: textInputRef.current.value,
            sender: props.username,
            time: new Date().getTime()
         }
         props.sendAndDisplayMessage(params)
         textInputRef.current.value = ""
         textInputRef.current.placeholder = "type a message here"
      }
      checkIfInputIsEmpty()
   }
   function enterKeyEvent(event) {
      if (event.keyCode == 13) {
         handleNewMessage();
         event.preventDefault();
      };
   }

   function getNormalTimeFromUTC(thisDate) {
      var pmOrAm
      var hoursNon24
      var minutesWithOrWithoutZero
      thisDate = new Date(thisDate)
      if (thisDate.getHours() > 12) {
         pmOrAm = 'PM'
         hoursNon24 = thisDate.getHours() - 12
      } else {
         pmOrAm = 'AM'
         hoursNon24 = thisDate.getHours()
         if (hoursNon24 === 0) {
            hoursNon24 = 12
         }
      }
      if (thisDate.getMinutes() <= 9) {
         minutesWithOrWithoutZero = '0'
      } else {
         minutesWithOrWithoutZero = ''
      }
      var output = (thisDate.getMonth()
         + 1 + '/' + thisDate.getDate())
         + '/' + thisDate.getFullYear()
         + ' ' + hoursNon24
         + ':' + minutesWithOrWithoutZero + thisDate.getMinutes()
         + ' ' + pmOrAm;
      return (output)
   }

   const mapedTexts = props.data.map((element, i) => {
      var senderName = element.sender
      var className = "othersMessage"
      if (element.sender === props.username) {
         senderName = "you"
         className = "yourMessage"
      }
      return (
         <div className={className} key={i} >
            <div className="info">
               <span className="sender">{senderName + " - "}</span>
               <span className="time">{"  " + getNormalTimeFromUTC(element.time)}</span>
            </div>
            {element.text}
         </div>
      )
   })
   return (
      <div className="TextsUi">
         <div
            className="messagesView"
            ref={messageViewRef}
         >
            {mapedTexts}
            <div />
         </div>
         <div className="messageInputs">
            <textarea
               onFocus={() => {
                  messageViewRef.current.lastChild.scrollIntoView();
               }}
               maxLength="170"
               ref={textInputRef}
               onKeyDown={(event) => { enterKeyEvent(event) }}
               placeholder="type a message here"
            />
            <button onClick={() => { handleNewMessage() }}>
               Send
            </button>
         </div>

      </div>
   )
}