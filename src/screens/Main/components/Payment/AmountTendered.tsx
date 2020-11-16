import cn from 'classnames';
import { useField } from 'formik';
import * as React from 'react';
import { numberWithCommas, removeCommas } from '../../../../utils/function';
import './style.scss';

export interface IInputProps {
	id?: string;
	classNames?: string;
	disabled?: boolean;
	autoFocus?: boolean;
	inputRef?: any;
}

const AmountTendered = ({ id, classNames, disabled, autoFocus, inputRef }: IInputProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [field, meta, helpers] = useField(id);

	const inputRe = /^[0-9/.\b]+\.?$/g;

	const onChange = (event) => {
		const value = event.target.value;
		const removedCommas = removeCommas(value);

		if (value === '') {
			helpers.setValue('');
		} else if (inputRe.test(removedCommas)) {
			helpers.setValue(numberWithCommas(removedCommas));
		}
	};

	return (
		<input
			{...field}
			ref={inputRef}
			name={id}
			className={cn('FormInput', classNames)}
			disabled={disabled}
			tabIndex={1}
			autoFocus={autoFocus}
			onChange={onChange}
		/>
	);
};

export default AmountTendered;
