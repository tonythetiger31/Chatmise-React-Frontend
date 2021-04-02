import React, { useRef, useEffect, useContext } from 'react';
import { socket } from '../../modules';
import validator from 'validator';
import { DataContext } from '../../index';

export default function CreateChat() {
	const { toggleComponent } = React.useContext(DataContext);
	var chatNameRef = useRef(null),
		buttonRef = useRef(null);

	function success() {
		alert('successfully created');
		window.location.reload();
	}
	function processNewChat() {
		const chatName = chatNameRef.current.value;

		const validate = (() => {
			validator.isAlphanumeric(chatName)
				? sendNewChatInfo()
				: alert('Chat name must be alphanumeric');
		})();
		function sendNewChatInfo() {
			socket.emit('newChat', {
				chatName: chatNameRef.current.value,
			});
			buttonRef.current.innerHTML = 'creating...';
			socket.on('newChat', body => {
				body === 200
					? success()
					: body === 400 || body === 500
					? alert('there was an error when creating your chat')
					: body === 403 &&
					  alert('you already have already created the max of 5 chats');
				buttonRef.current.innerHTML = 'CREATE';
			});
		}
	}
	function stopSpaces(event) {
		if (event.keyCode == 32) {
			event.preventDefault();
		}
	}
	useEffect(() => {
		chatNameRef.current.focus();
   }, []);
   
	return (
		<div className="CreateChat">
			<a type="button" onClick={() => toggleComponent('CreateChat')} />
			<div className="title">Create Chat</div>
			<form
				onSubmit={event => {
					processNewChat();
					event.preventDefault();
				}}
			>
				<input
					placeholder="Chat Name"
					maxLength="10"
					minLength="4"
					ref={chatNameRef}
					required
					size="15"
					onKeyDown={event => {
						stopSpaces(event);
					}}
				/>
				<button ref={buttonRef} type="submit" className="Create">
					Create
				</button>
			</form>
		</div>
	);
}
