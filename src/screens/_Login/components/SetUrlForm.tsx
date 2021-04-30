/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel } from '../../../components/elements';
import { sleep } from '../../../utils/function';
import '../style.scss';

export interface IRegisterValues {
	login: string;
	password: string;
	machineName: string;
	machineId: string;
	machinePrinterSerialNumber: string;
}

interface ISetUrlForm {
	onSubmit: any;
	loading?: boolean;
}

export const SetUrlForm = ({ loading, onSubmit }: ISetUrlForm) => {
	// STATES
	const [isSubmitting, setIsSubmitting] = useState(false);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				login: '',
				password: '',
			},
			Schema: Yup.object().shape({
				login: Yup.string().required().label('Username'),
				password: Yup.string().required().label('Password'),
			}),
		}),
		[],
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
						<FormInputLabel id="login" label="Branch Manager Username" />
						{errors.login && touched.login ? <FieldError error={errors.login} /> : null}
					</div>

					<div className="input-field">
						<FormInputLabel type="password" id="password" label="Branch Manager Password" />
						{errors.password && touched.password ? <FieldError error={errors.password} /> : null}
					</div>

					<Button
						type="submit"
						text="Set API URL"
						variant="secondary"
						loading={loading || isSubmitting}
						block
					/>
				</Form>
			)}
		</Formik>
	);
};
