import React, { useRef, useState, useEffect, useContext } from 'react';
import validator from 'validator';
import { DataContext,socket } from '../../index';

export default function InviteMenu() {
	const { appData, currentChat, toggleComponent } = useContext(DataContext),
		chatId = appData.chatIds[currentChat],
		[message, setMessage] = useState(null),
		[previousInput, setPreviousInput] = useState(null);
	const successStyle = {
			backgroundColor: 'var(--darkGreenColor)',
			color: 'var(--textColor)',
		},
		loadingStyle = {
			backgroundColor: 'var(--bodyColor)',
			color: 'var(--textColor)',
		};
	var input = useRef(null),
		button = useRef(null);

	function sendFormData() {
		const invitee = input.current.value;
		const isValidConditions =
			validator.isLength(invitee, { min: 0, max: 10 }) &&
			validator.isAlphanumeric(invitee);

		const validate = (() => {
			setPreviousInput(prev => {
				invitee === prev
					? setMessage({ text: 'already tried that', color: {} })
					: invitee === appData.username
					? setMessage({ text: "can't invite yourself", color: {} })
					: isValidConditions
					? sendMessage()
					: setMessage({ text: 'Must be AlphaNumeric', color: {} });

				return invitee;
			});
		})();
		function sendMessage() {
			socket.emit('invite', {
				chatId: chatId,
				invitee: invitee,
			});
			setMessage({ text: 'Sending...', color: loadingStyle });
			receiveMessage();
		}
		function receiveMessage() {
			socket.on('invite', data => {
				data === 200
					? setMessage({
							text: 'Invite Sent!',
							color: successStyle,
					  })
					: data === 404
					? setMessage({ text: 'user not found', color: {} })
					: data === 409
					? setMessage({ text: 'user aleady invited', color: {} })
					: setMessage({ text: 'error', color: {} });
			});
		}
	}
	useEffect(() => {
		input.current.focus();
	}, []);

	return (
		<div className="InviteMenu">
			<a type="button" onClick={() => toggleComponent('InviteMenu')} />
			<div className="title">Invite</div>
			<div className="subTitle">Invite your friends to this chat</div>
			<form
				className="invite"
				onSubmit={event => {
					event.preventDefault();
					sendFormData();
				}}
			>
				<input
					ref={input}
					required
					placeholder="Invite somone"
					size="14"
					maxLength="10"
				/>
				<button type="submit" ref={button}>
					Send
				</button>
			</form>
			{message && (
				<div className="message" style={message.color}>
					{message.text}
				</div>
			)}
		</div>
	);
}
