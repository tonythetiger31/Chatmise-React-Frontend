import React, { useContext } from 'react';
import { DataContext } from '../index';

export default function HamburgerMenu() {
   const {appData, currentChat, toggleComponent, toggleHamburgerMenu} = useContext(DataContext);

   const bugReportURL = 'https://tipsandbugreport.netlify.app/';

	async function logout() {
		const options = {
			method: 'delete',
		};
		const response = await fetch('/logout', options);
		const json = await response.json();
		window.location.replace('/login');
	}

	const isAdmin = appData.username === appData.admins[currentChat];
	return (
		<div className="HamburgerMenu">
			<a
				className="exitButton"
				onClick={() => toggleHamburgerMenu()}
			/>
			<div className="youAreLoggedInAs">Logged in as {appData.username} </div>
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
				<a href="/home">Home</a>
				<pre> | </pre>
				<a href={bugReportURL}>Report Bug</a>
			</div>
			{/**
			 * chatInfo
			 * settings
			 * yourInvites
			 * InviteMenu
			 */}
		</div>
	);
}
