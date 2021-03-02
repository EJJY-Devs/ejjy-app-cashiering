import cn from 'classnames';
import { Field } from 'formik';
import * as React from 'react';
import './style.scss';

export interface IInputProps {
	id?: string;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	max?: number;
	min?: number;
	classNames?: string;
	autoFocus?: boolean;
	inputRef?: any;
	step?: string;
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
	inputRef,
	step,
}: IInputProps) => (
	<Field
		innerRef={inputRef}
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
		step={step}
		onKeyDown={(evt) => {
			if (type === 'number' && ['e', 'E', '+', '-'].includes(evt.key)) {
				evt.preventDefault();
			}
		}}
	/>
);

FormInput.defaultProps = {
	type: 'text',
	placeholder: '',
	disabled: false,
};

export default FormInput;
