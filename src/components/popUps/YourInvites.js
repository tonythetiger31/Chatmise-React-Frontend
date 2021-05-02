import React, { useContext } from 'react';
import { DataContext,socket } from '../../index';

export default function YourInvites(props) {
	const { appData, toggleComponent } = useContext(DataContext);

	function acceptInvite(isAccepted, chatId) {
		socket.emit('acceptInvite', {
			chatId: chatId,
			isAccepted: isAccepted,
		});
		socket.on('acceptInvite', body => {
			if (body !== 200) {
				alert('error', body);
			} else if (isAccepted) {
				alert('success');
				window.location.reload();
			} else if (!isAccepted) {
				updateState();
			}
		});
		function updateState() {
			props.setAppData(prevState => {
				var newInvites = [];
				for (var element of prevState.invites) {
					element._id !== chatId && newInvites.push();
				}
				return {
					...prevState,
					invites: newInvites,
				};
			});
		}
	}
	const invites = appData.invites.map((element, i) => {
		console.log(element);
		return (
			<div className="individualInvite" key={i}>
				{`${element.admin} - ${element.chatName} `}
				<button
					className="accept"
					onClick={() => acceptInvite(true, element._id)}
				>
					accept
				</button>
				<button
					className="decline"
					onClick={() => acceptInvite(false, element._id)}
				>
					decline
				</button>
			</div>
		);
	});
	return (
		<div className="YourInvites">
			<a onClick={() => toggleComponent('YourInvites')} />
			<div className="title">Your Invites</div>
			{invites.length !== 0 ? (
				invites
			) : (
				<div className="noInvites">you have no invites</div>
			)}
		</div>
	);
}
