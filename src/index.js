//dependencies
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
//components
import TextsUi from './components/TextsUi.js';
import ChatMenu from './components/ChatMenu.js';
import TopBar from './components/TopBar.js';
import HamburgerMenu from './components/HamburgerMenu.js';
import Settings from './components/popUps/Settings.js';
import CreateChat from './components/popUps/CreateChat.js';
import ChatInfo from './components/popUps/ChatInfo';
import InviteMenu from './components/popUps/InviteMenu.js';
import YourInvites from './components/popUps/YourInvites.js';
//other files
import css from './scss/App.scss';
import themes from './themes.js';
import ping from './resources/ping.mp3';
import * as modules from './modules.js';
//exports
export const DataContext = React.createContext();
var socket;
export { socket };

window.gapi.load('client:auth2', async () => {
	const googleAuth = await window.gapi.auth2.init({
		client_id:
			'407415747373-v23ak1k7kp37k3s986mu5qh9cpqh9bdh.apps.googleusercontent.com',
	});
	const googleUser = googleAuth.currentUser.get();
	const token = googleUser.getAuthResponse().id_token;
	socket = io(modules.URL(), {
		withCredentials: true,
		query: {
			token: token,
		},
	});

	ReactDOM.render(
		<React.StrictMode>
			<App/>	
		</React.StrictMode>,
		document.getElementById('root')
	);
});

function App() {
	const [appData, setAppData] = useState({
		texts: [
			[
				{
					time: 0,
					text: 'Loading...',
					sender: 'Loading...',
				},
			],
		],
		chatNames: ['Loading...'],
		chatIds: ['Loading...'],
		username: 'Loading...',
		admins: ['Loading...'],
		members: ['Loading...'],
		invites: ['Loading...'],
	});
	const [
		render,
		setRender,
		toggleHamburgerMenu,
		toggleChatMenu,
		toggleComponent,
		exitPopUp,
	] = modules.useRender();
	const [reload, setReload] = useState(false);
	const [currentChat, setCurrentChat] = useState(0);
	const [theme, setTheme] = useState(1);
	const audio = new Audio(ping);
	const isDevEnv = process.env.NODE_ENV === 'development';

	useEffect(async () => {
		socket.on('allTexts', body => {
			if (body === 500) {
				console.log('server error');
			} else if (body !== 'invalid credentials') {
				setReload(true);
				setAppData(body);
				changeTheme(body.settings);
			} else {
				!isDevEnv && (window.location = '/home');
			}
		});
		socket.on('texts', body => {
			displayMessage(body);
			if (document.visibilityState !== 'visible') {
				audio.play();
			}
		});
		socket.on('disconnect', () => {
			setRender({
				...render,
				InternetWarning: true,
				GrayBackground: true,
			});
			setReload(oldState => {
				if (oldState === true) {
					console.log('reload');
					window.location.reload();
				}
				return oldState;
			});
		});
	}, []);

	function sendAndDisplayMessage(message) {
		displayMessage(message);
		socket.emit('texts', {
			text: message.text,
			time: message.time,
			chatId: appData.chatIds[currentChat],
		});
	}
	//style functions
	const changeCurrentChat = arg => {
		if (window.screen.width <= 760) {
			setRender({
				...render,
				ChatMenu: false,
				RightContainer: true,
			});
		}
		setCurrentChat(arg);
	};
	function displayMessage(message) {
		setAppData(prevState => {
			var chatToAddTo = currentChat;
			if (message.chatId) {
				chatToAddTo = prevState.chatIds.indexOf(message.chatId);
			}
			console.log({ chatToAddTo, message });
			var newTexts = prevState.texts.map((element, i) => {
				var result = element;
				if (i === chatToAddTo) {
					result = element.concat([message]);
				}
				return result;
			});
			console.log({ newTexts }, prevState.texts);
			return {
				...prevState,
				texts: newTexts,
			};
		});
	}
	const changeTheme = arg => {
		try {
			var value = arg.target.value;
			socket.emit('settings', {
				settings: value,
			});
		} catch (err) {
			var value = arg;
		}
		var keys = Object.keys(themes[value]),
			values = Object.values(themes[value]);
		setTheme(value);
		keys.forEach((element, i) => {
			document.documentElement.style.setProperty(`--${element}`, values[i]);
		});
	};
	return (
		<>
			{reload ? (
				<div className="App">
					<DataContext.Provider
						value={{
							appData,
							currentChat,
							toggleComponent,
							toggleHamburgerMenu,
							render,
						}}
					>
						{render.GrayBackground && (
							<modules.GrayBackground exitPopUp={exitPopUp} />
						)}
						{render.Settings && (
							<Settings changeTheme={changeTheme} theme={theme} />
						)}
						{render.ChatMenu && (
							<ChatMenu
								changeCurrentChat={arg => changeCurrentChat(arg)}
								toggleChatMenu={toggleChatMenu}
							/>
						)}
						{render.ChatInfo && <ChatInfo />}
						{render.CreateChat && <CreateChat />}
						{render.InviteMenu && <InviteMenu />}
						{render.YourInvites && (
							<YourInvites setAppData={setAppData} />
						)}
						{render.InternetWarning && <modules.InternetWarning />}

						{render.RightContainer && (
							<div className="rightContainer">
								{render.TobBar && (
									<TopBar
										renHamburgerMenu={render.HamburgerMenu}
										toggleHamburgerMenu={toggleHamburgerMenu}
										toggleChatMenu={toggleChatMenu}
									/>
								)}
								{render.HamburgerMenu && (
									<HamburgerMenu
										setReload={() => {
											setReload();
										}}
									/>
								)}
								{render.TextUi && (
									<TextsUi
										sendAndDisplayMessage={arg =>
											sendAndDisplayMessage(arg)
										}
									/>
								)}
							</div>
						)}
					</DataContext.Provider>
				</div>
			) : (
				<div className="loaderContainer">
					<div className="loader"></div>
				</div>
			)}
		</>
	);
}
