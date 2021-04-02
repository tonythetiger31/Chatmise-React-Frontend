import React, { useState } from 'react';
import { io } from 'socket.io-client';

function useRender() {
	var isMobile =
		window.screen.width <= 760 && window.screen.orientation.angle === 0;
	const [render, setRender] = useState({
		InternetWarning: false,
		ChatMenu: true,
		RightContainer: isMobile ? false : true,
		TobBar: true,
		TextUi: true,
		GrayBackground: false,
		HamburgerMenu: false,
		Settings: false,
		CreateChat: false,
		ChatInfo: false,
		InviteMenu: false,
		YourInvites: false,
	});
	const toggleHamburgerMenu = () => {
		setRender(prevState => {
			var bools = {
				...render,
				HamburgerMenu: false,
				RightContainer: true,
				ChatMenu: true,
			};
			if (isMobile) {
				if (!prevState.HamburgerMenu) {
					bools.TextUi = false;
					bools.ChatMenu = false;
					bools.HamburgerMenu = true;
					bools.TobBar = false;
				} else {
					bools.ChatMenu = false;
					bools.RightContainer = true;
					bools.TobBar = true;
					bools.TextUi = true;
				}
			} else {
				if (!prevState.HamburgerMenu) {
					bools.HamburgerMenu = true;
				}
			}
			return bools;
		});
	};
	function toggleComponentRender(component) {
		setRender(prevState => {
			return {
				...render,
				[component]: !prevState[component],
				GrayBackground: !prevState[component],
			};
		});
	}
	const toggleChatMenu = () => {
		setRender(prevState => {
			return {
				...render,
				ChatMenu: !prevState.ChatMenu,
				RightContainer: prevState.ChatMenu,
			};
		});
	};
	const exitPopUp = () => {
		setRender(prevState => {
			return {
				...prevState,
				GrayBackground: false,
				Settings: false,
				CreateChat: false,
				ChatInfo: false,
				InviteMenu: false,
				YourInvites: false,
			};
		});
	};
	return [
		render,
		setRender,
		toggleHamburgerMenu,
		toggleChatMenu,
		toggleComponentRender,
		exitPopUp,
	];
}

const InternetWarning = () => {
	<div className="InternetWarning">
		Connection error, please check your internet
	</div>
};
const GrayBackground = props => (
	<div className="GrayBackground" onClick={() => props.exitPopUp()} />
);

function Time(props) {
	var { time } = props;
	time = new Date(time);
	var [hours, minutes, period] = [time.getHours(), time.getMinutes(), 'AM'];
	if (hours > 12) {
		period = 'PM';
		hours -= 12;
	} else {
		hours === 0 && (hours = 12);
	}
	minutes <= 9 && (minutes += '0');
	const [month, day, year] = [
		time.getMonth() + 1,
		time.getDate(),
		time.getFullYear(),
	];
	return (
		<span className="time">
			{month}/{day}/{year + ' '}
			{hours}:{minutes + ' ' + period}
		</span>
	);
}

//socket
function URL() {
	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:8080/';
	} else {
		return '/';
	}
}
var socket = io(URL(), {
	withCredentials: true,
});

export { useRender, socket, InternetWarning, GrayBackground, Time };
