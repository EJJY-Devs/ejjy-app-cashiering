import { Field } from 'formik';
import * as React from 'react';
import './style.scss';
import cn from 'classnames';

export interface IInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	classNames?: string;
	autoFocus?: boolean;
}

const FormInput = ({
	type,
	id,
	max,
	min,
	placeholder,
	disabled,
	autoFocus,
	classNames,
}: IInputProps) => (
	<Field
		type={type}
		id={id}
		name={id}
		className={cn('FormInput', classNames)}
		placeholder={placeholder}
		max={max}
		min={min}
		disabled={disabled}
		tabIndex={1}
		autoFocus={autoFocus}
	/>
);

FormInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default FormInput;
