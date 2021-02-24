import React from 'react'
import TextsUi from './TextsUi.js'
import ChatMenu from './ChatMenu.js'
import allData from '../data.js'
import data from '../data.js'
export default class MainUi extends React.Component {
   constructor(){
      super()
      this.state = {
         data: data,
         currentChat: data.texts[0]
      }
      this.changeCurrentChat = this.changeCurrentChat.bind(this)
   }
   changeCurrentChat(arg){
      console.log('ran')
      this.setState({
         currentChat: data.texts[arg]
      })
   }
   render(){
      return(
         <div className="MainUi">
            <ChatMenu action={(arg)=>{this.changeCurrentChat(arg)}} data={this.state.data.chats} />
            <TextsUi data={this.state.currentChat}/>
         </div>
      ) 
   }
}