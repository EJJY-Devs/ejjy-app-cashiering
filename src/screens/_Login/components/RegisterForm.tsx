/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel, FormSelectLabel } from '../../../components/elements';
import { sleep } from '../../../utils/function';
import '../style.scss';

export interface IRegisterValues {
	login: string;
	password: string;
	machineName: string;
	machineId: string;
	machinePrinterSerialNumber: string;
}

interface IRegisterForm {
	onSubmit: any;
	loading?: boolean;
	branchMachinesOptions: any;
}

export const RegisterForm = ({ branchMachinesOptions, loading, onSubmit }: IRegisterForm) => {
	// STATES
	const [isSubmitting, setIsSubmitting] = useState(false);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				login: '',
				password: '',
				machineName: branchMachinesOptions?.[0]?.name,
			},
			Schema: Yup.object().shape({
				login: Yup.string().required().label('Username'),
				password: Yup.string().required().label('Password'),
				machineName: Yup.string().required().label('Branch machine'),
			}),
		}),
		[branchMachinesOptions],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values: IRegisterValues) => {
				setIsSubmitting(true);
				await sleep(500);
				setIsSubmitting(false);

				onSubmit(values);
			}}
		>
			{({ errors, touched }) => (
				<Form className="form">
					<div className="input-field">
						<FormInputLabel id="login" label="Admin Username" />
						{errors.login && touched.login ? <FieldError error={errors.login} /> : null}
					</div>

					<div className="input-field">
						<FormInputLabel type="password" id="password" label="Admin Password" />
						{errors.password && touched.password ? <FieldError error={errors.password} /> : null}
					</div>

					<div className="input-field">
						<FormSelectLabel
							id="machineName"
							label="Branch Machine"
							options={branchMachinesOptions}
						/>
						{errors.machineName && touched.machineName ? (
							<FieldError error={errors.machineName} />
						) : null}
					</div>

					<Button
						type="submit"
						text="Register Machine"
						variant="secondary"
						loading={loading || isSubmitting}
						block
					/>
				</Form>
			)}
		</Formik>
	);
};
