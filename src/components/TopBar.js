import React, { useContext } from 'react';
import exitSvg from '../resources/exit.svg';
import hamburgerSvg from '../resources/hamburger.svg';
import { DataContext } from '../index';

export default function TopBar(props) {
	const { appData, currentChat } = useContext(DataContext);

	var style = { content: `url(${hamburgerSvg})` };
	const conditionalRender = (() => {
		props.HamburgerMenu
			? (style = { content: `url(${exitSvg})` })
			: (style = { content: `url(${hamburgerSvg})` });
	})();
	return (
		<div className="TopBar">
			<a className="chatButton" onClick={() => props.toggleChatMenu()} />
			<div>{appData.chatNames[currentChat]}</div>
			<a
				className="hamburgerButton"
				type="button"
				onClick={() => {
					props.toggleHamburgerMenu();
				}}
				style={style}
			/>
		</div>
	);
}
