import React from 'react'
export default class TextsUi extends React.Component {
   constructor(props) {
      super()
      this.textInput = React.createRef()
      this.messageView = React.createRef()
   }
   handleNewMessage(){
      const params = { text: this.textInput.current.value }
      this.props.action(params)
      this.textInput.current.value = ""
   }
   enterKeyEvent(event) {
      if (event.keyCode == 13) {
         this.handleNewMessage();
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
      const mapedTexts = this.props.data.map((element, i) => {
         return (
            <div className="individualMessage" key={i} >{element.text}</div>
         )
      })
      return (
         console.log("render"),
         <div className="TextsUi" >
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