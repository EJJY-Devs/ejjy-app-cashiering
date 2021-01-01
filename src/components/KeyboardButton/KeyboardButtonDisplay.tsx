import React from 'react';
import './style.scss';

interface Props {
	keyboardKey: string;
}

export const KeyboardButtonDisplay = ({ keyboardKey }: Props) => {
	return <div className="KeyboardButtonDisplay">{keyboardKey}</div>;
};
