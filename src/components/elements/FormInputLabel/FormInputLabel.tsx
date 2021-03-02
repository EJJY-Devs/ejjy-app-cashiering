import * as React from 'react';
import FormInput, { IInputProps } from '../FormInput/FormInput';
import Label from '../Label/Label';

interface Props extends IInputProps {
	label: string;
	labelClassname?: string;
	inputClassname?: string;
}

const FormInputLabel = ({
	id,
	labelClassname,
	label: inputLabel,
	inputClassname,
	type,
	max,
	min,
	placeholder,
	disabled,
	step,
	inputRef,
}: Props) => (
	<>
		<Label id={id} label={inputLabel} classNames={labelClassname} spacing />
		<FormInput
			classNames={inputClassname}
			type={type}
			id={id}
			max={max}
			min={min}
			placeholder={placeholder}
			disabled={disabled}
			inputRef={inputRef}
			step={step}
		/>
	</>
);

export default FormInputLabel;
