import React from 'react'
export default class TextsUi extends React.Component {
   constructor(props) {
      super()
      this.state = {
         messages: props.data
      }
      this.textInput = React.createRef()
      this.messageView = React.createRef()
      this.appendNewMessage = this.appendNewMessage.bind(this)
   }
   appendNewMessage() {
      const params = { text: this.textInput.current.value }
      this.setState((prevState) => {
         const updated = prevState.messages.concat([params])
         return {
            messages: updated
         }
      })
      this.textInput.current.value = ""
   }
   enterKeyEvent(event) {
      if (event.keyCode == 13) {
         this.appendNewMessage();
         event.preventDefault();
      };
   }
   componentDidMount() {
      this.messageView.current.lastChild.scrollIntoView();
   }
   componentDidUpdate() {
      this.messageView.current.lastChild.scrollIntoView();
   }
   render() {
      const mapedTexts = this.state.messages.map((element, i) => {
         return (
            <div className="individualMessage" key={i} >{element.text}</div>
         )
      })
   return(
         <div className = "TextsUi" >
            <div className="messagesView" ref={this.messageView}>
               {mapedTexts}
            </div>
            <div className="messageInputs">
               <textarea
                  ref={this.textInput}
                  onKeyDown={(event) => { this.enterKeyEvent(event) }}
                  placeholder="type a message here"
               />
               <button
                  onClick={() => {
                     this.appendNewMessage()
                  }}
               >Enter</button>
            </div>
         </div>
      )
   }
}