import React, { useRef, useEffect, useContext } from 'react';
import validator from 'validator';
import { DataContext } from '../index';
import { Time } from '../modules';

export default function TextsUi(props) {
	const { appData, currentChat } = useContext(DataContext);
   var texts = appData.texts[currentChat];
   if (!texts) {
      texts = [
         {
            time: 0,
            text: 'create a chat or ask a freind to invite you to theirs',
            sender: 'server',
         },
      ]
   }
   
	var textInputRef = useRef(null),
   messageViewRef = useRef(null);
	var oldProps = {};
   
	useEffect(() => {
		oldProps = texts;
		messageViewRef.current.lastChild.scrollIntoView();
	}, []);
	useEffect(() => {
		if (texts !== oldProps && texts[0] === oldProps[0]) {
			//newProps
			console.log('it worked!');
			oldProps = texts;
			if (window.screen.width > 760) {
				messageViewRef.current.lastChild.scrollIntoView({
					behavior: 'smooth',
				});
			} else {
				messageViewRef.current.lastChild.scrollIntoView();
			}
		} else {
			//sameProps
			messageViewRef.current.lastChild.scrollIntoView();
		}
	}, [props]);

	function handleNewMessage() {
		const checkIfInputIsEmpty = () => {
			textInputRef.current.value === ''
				? (textInputRef.current.placeholder =
						'that was an empty message :(')
				: validator.contains(textInputRef.current.value, '\\')
				? alert("please don't use backslashes")
				: sendMessage();
		};
		const sendMessage = () => {
			textInputRef.current.focus();
			var params = {
				text: textInputRef.current.value,
				sender: appData.username,
				time: new Date().getTime(),
			};
			props.sendAndDisplayMessage(params);
			textInputRef.current.value = '';
			textInputRef.current.placeholder = 'type a message here';
		};
		checkIfInputIsEmpty();
	}
	function enterKeyEvent(event) {
		if (event.keyCode == 13) {
			handleNewMessage();
			event.preventDefault();
		}
	}

	const mapedTexts = texts.map((element, i) => {
		var senderName = element.sender;
		var className = 'othersMessage';
		if (element.sender === appData.username) {
			senderName = 'you';
			className = 'yourMessage';
		}
		return (
			<div className={className} key={i}>
				<div className="info">
					<span className="sender">{senderName + ' - '}</span>
               <Time time={element.time}/>
				</div>
				{element.text}
			</div>
		);
	});
	return (
		<div className="TextsUi">
			<div className="messagesView" ref={messageViewRef}>
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
					onKeyDown={event => {
						enterKeyEvent(event);
					}}
					placeholder="type a message here"
				/>
				<button
					onClick={() => {
						handleNewMessage();
					}}
				>
					Send
				</button>
			</div>
		</div>
	);
}
