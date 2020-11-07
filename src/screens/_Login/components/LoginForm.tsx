import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel } from '../../../components/elements';
import { sleep } from '../../../utils/function';
import '../style.scss';

export interface ILoginValues {
	login: string;
	password: string;
}

interface ILoginForm {
	errors: string[];
	onSubmit: any;
	loading: boolean;
}

export const LoginForm = ({ loading, errors, onSubmit }: ILoginForm) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				login: '',
				password: '',
			},
			Schema: Yup.object().shape({
				login: Yup.string().required('Username is required'),
				password: Yup.string().required('Password is required'),
			}),
		}),
		[],
	);

	return (
		<>
			<div className="errors">
				{errors.map((error, index) => (
					<FieldError key={index} error={error} />
				))}
			</div>

			<Formik
				initialValues={getFormDetails().DefaultValues}
				validationSchema={getFormDetails().Schema}
				onSubmit={async (values: ILoginValues) => {
					setIsSubmitting(true);
					await sleep(500);
					setIsSubmitting(false);

					onSubmit(values);
				}}
			>
				{({ errors, touched }) => (
					<Form className="form">
						<div className="input-field">
							<FormInputLabel id="login" label="Username" />
							{errors.login && touched.login ? <FieldError error={errors.login} /> : null}
						</div>

						<div className="input-field">
							<FormInputLabel type="password" id="password" label="Password" />
							{errors.password && touched.password ? <FieldError error={errors.password} /> : null}
						</div>

						<Button
							type="submit"
							text="Start Session"
							variant="secondary"
							loading={loading || isSubmitting}
							block
						/>
					</Form>
				)}
			</Formik>
		</>
	);
};
