import React from 'react'
export default class TextsUi extends React.Component {
   constructor(props) {
      super()
      this.textInput = React.createRef()
      this.messageView = React.createRef()
      this.scrollBehavior = {scrollBehavior: "auto"}
   }
   handleNewMessage() {
      if (this.textInput.current.value !== "") {
         this.scrollBehavior = {
            scrollBehavior: "smooth"
         }
         var params = { text: this.textInput.current.value }
         this.props.action(params)
         this.textInput.current.value = ""
         this.textInput.current.placeholder = "type a message here"
         
      } else {
         this.textInput.current.placeholder = "that was an empty message :("
      }
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
   }
   componentDidUpdate() {
      this.messageView.current.lastChild.scrollIntoView();
   }
   render() {
      if(this.props.data === this.oldProps){
         this.scrollBehavior = {scrollBehavior: "auto"}
      } else {
         this.oldProps = this.props.data
      }
      const mapedTexts = this.props.data.map((element, i) => {
         return (
            <div className="individualMessage" key={i} >{element.text}</div>
         )
      })
      return (
         <div className="TextsUi" >
            <div
               className="messagesView"
               ref={this.messageView}
               style={this.scrollBehavior}
            >
               {mapedTexts}
            </div>
            <div className="messageInputs">
               <textarea
                  ref={this.textInput}
                  onKeyDown={(event) => { this.enterKeyEvent(event) }}
                  placeholder="type a message here"
               />
               <button onClick={() => { this.handleNewMessage() }}>
                  Enter
               </button>
            </div>
         </div>
      )
   }
}