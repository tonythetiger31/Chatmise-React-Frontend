import { useContext } from 'react';
import { DataContext } from '../../index';

export default function ChatInfo() {
	const { appData, currentChat, toggleComponent, render } = useContext(
		DataContext
	);

	var members = appData.members[currentChat].map((element, i) => {
		return (
			<div className="members" key={i}>
				{element === appData.username ? 'You' : element} <br />
			</div>
		);
	});

	const isChatAdmin = appData.username === appData.admins[currentChat];
	return (
		<div className="ChatInfo">
			<a type="button" onClick={() => toggleComponent('ChatInfo')} />
			<div className="title">Chat Info</div>
			<div className="subTitle">
				admin:
				<span className="adminInfo">
					{isChatAdmin ? 'You' : appData.admins[currentChat]}
				</span>
			</div>
			<div className="subTitle">members</div>
			<div className="info">{members}</div>
		</div>
	);
}
