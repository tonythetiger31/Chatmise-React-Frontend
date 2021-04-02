import React, { useContext } from 'react';
import themes from '../../themes.js';
import { DataContext } from '../../index';

export default function HamburgerMenu(props) {
	const { toggleComponent } = useContext(DataContext);

	const themeOptions = themes.map((element, i) => {
		return (
			<option value={i} key={i}>
				{element.name}
			</option>
		);
	});

	return (
		<div className="Settings">
			<a type="button" onClick={() => toggleComponent('Settings')}></a>
			<div className="title">Settings</div>
			<div>Theme</div>
			<select value={props.theme} onChange={props.changeTheme}>
				{themeOptions}
			</select>
		</div>
	);
}
