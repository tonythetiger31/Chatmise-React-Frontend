import { buildQueries } from '@testing-library/react'
import React from 'react'
export default class TextsUi extends React.Component {
   constructor(props) {
      super()
      this.textInput = React.createRef()
      this.messageView = React.createRef()
      this.oldProps = {}
   }
   handleNewMessage() {
      const checkIfInputIsEmpty = () => {
         if (this.textInput.current.value !== "") {
            sendMessage()
         } else {
            this.textInput.current.placeholder = "that was an empty message :("
         }
      }
      const sendMessage = () => {
         this.textInput.current.focus()
         var params = {
            text: this.textInput.current.value,
            sender: this.props.username,
            time: new Date().getTime()
         }
         this.props.sendAndDisplayMessage(params)
         this.textInput.current.value = ""
         this.textInput.current.placeholder = "type a message here"
      }
      checkIfInputIsEmpty()
   }
   enterKeyEvent(event) {
      if (event.keyCode == 13) {
         this.handleNewMessage();
         event.preventDefault();
      };
   }
   componentDidMount() {
      this.oldProps = this.props.data
      this.messageView.current.lastChild.scrollIntoView();
      this.textInput.current.focus()
   }
   componentDidUpdate() {
      if (this.props.data !== this.oldProps &&
         this.props.data[0] === this.oldProps[0]
      ) {//newProps
         console.log('it worked!')
         this.oldProps = this.props.data
         if (window.screen.width > 760) {
            this.messageView.current.lastChild.scrollIntoView({ behavior: "smooth" });
         } else {
            this.messageView.current.lastChild.scrollIntoView();
         }
      } else {//sameProps
         this.messageView.current.lastChild.scrollIntoView();
      }
   }
   render() {
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
      const mapedTexts = this.props.data.map((element, i) => {
         var senderName = element.sender
         var textColor = { color: "#52fb9e" }
         if (element.sender === this.props.username) {
            senderName = "you"
            textColor = { color: "#63caec" }
         }
         return (
            <div className="individualMessage" key={i} style={textColor} >
               <div className="info">
                  <span className="sender">{senderName + " - "}</span>
                  <span className="time">{"  " + getNormalTimeFromUTC(element.time)}</span>
               </div>
               {element.text}
            </div>
         )
      })
      return (
         <div className="TextsUi" style={this.props.style}>
            <div
               className="messagesView"
               ref={this.messageView}
            >
               {mapedTexts}
               <div ref={this.fix} />
            </div>
            <div className="messageInputs">
               <textarea
                  onFocus={() => {
                     this.messageView.current.lastChild.scrollIntoView();
                  }}
                  maxLength="170"
                  ref={this.textInput}
                  onKeyDown={(event) => { this.enterKeyEvent(event) }}
                  placeholder="type a message here"
               />
               <button onClick={() => { this.handleNewMessage() }}>
                  Send
               </button>
            </div>

         </div>
      )
   }
}