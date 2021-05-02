import React, { useContext } from 'react';
import { DataContext } from '../index';

export default function HamburgerMenu(props) {
	const {
		appData,
		currentChat,
		toggleComponent,
		toggleHamburgerMenu,
	} = useContext(DataContext);

	const bugReportURL = 'https://tipsandbugreport.netlify.app/';

	async function logout() {
		var auth2 = window.gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
         console.log('User signed out.');
         props.setReload(false)
         window.location = '/home';
		});
	}

	const isAdmin = appData.username === appData.admins[currentChat];
	return (
		<div className="HamburgerMenu">
			<a className="exitButton" onClick={() => toggleHamburgerMenu()} />
			<div className="youAreLoggedInAs">
				Logged in as {appData.username}{' '}
			</div>
			{isAdmin && (
				<div>
					<button onClick={() => toggleComponent('InviteMenu')}>
						Invite
					</button>
					<br />
				</div>
			)}
			<button onClick={() => toggleComponent('ChatInfo')}>Chat Info</button>
			<br />
			<button onClick={() => toggleComponent('Settings')}>Settings</button>
			<br />
			<button onClick={() => toggleComponent('YourInvites')}>
				Your Invites
			</button>
			<br />
			<button onClick={() => logout()}>Logout</button>
			<br />
			<div className="links">
				<a href="/home" onClick={()=>props.setReload(false)}>Home</a>
				<pre> | </pre>
				<a href={bugReportURL} onClick={()=>props.setReload(false)}>Report Bug</a>
			</div>
		</div>
	);
}
