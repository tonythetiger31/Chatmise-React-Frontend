import React, { useContext } from 'react';
import { DataContext } from '../index';

export default function ChatMenu(props) {
	const { appData, toggleComponent } = useContext(DataContext);

	const mapedChats = appData.chatNames.map((element, i) => {
		return (
			<div
				className="individualChat"
				onClick={() => {
					props.changeCurrentChat(i);
				}}
				key={i}
			>
				{element}
			</div>
		);
	});
	return (
		<div className="ChatMenu">
			<div className="topBar">
				<a className="exitButton" onClick={() => props.toggleChatMenu()} />
				Chats
			</div>
			<div className="chats">{mapedChats}</div>
			<button
				className="createChatButton"
				onClick={() => toggleComponent('CreateChat')}
			>
				+
			</button>
		</div>
	);
}
