import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel } from '../../../components/elements';
import { sleep } from '../../../utils/function';
import '../style.scss';

declare global {
	interface Window {
		epson: any;
	}
}

export interface ILoginValues {
	login: string;
	password: string;
}

interface ILoginForm {
	errors: string[];
	onSubmit: any;
	loading: boolean;
	submitText?: string;
	isManager?: boolean;
	shouldFullScreen?: boolean;
}

export const LoginForm = ({
	shouldFullScreen,
	loading,
	errors,
	onSubmit,
	submitText,
	isManager,
}: ILoginForm) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

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
		<>
			<div className="errors">
				{errors.map((error, index) => (
					<FieldError key={index} error={error} />
				))}
			</div>

			<Formik
				initialValues={getFormDetails().DefaultValues}
				validationSchema={getFormDetails().Schema}
				onSubmit={async (values: ILoginValues, { resetForm }) => {
					setIsSubmitting(true);
					await sleep(500);
					setIsSubmitting(false);

					onSubmit(values);
					resetForm();
				}}
			>
				{({ errors, touched }) => (
					<Form className="form">
						<div className="input-field">
							<FormInputLabel id="login" label={`${isManager ? "Manager's" : ''} Username`} />
							{errors.login && touched.login ? <FieldError error={errors.login} /> : null}
						</div>

						<div className="input-field">
							<FormInputLabel
								type="password"
								id="password"
								label={`${isManager ? "Manager's" : ''} Password`}
							/>
							{errors.password && touched.password ? <FieldError error={errors.password} /> : null}
						</div>

						<Button
							type="submit"
							text={submitText}
							variant="secondary"
							loading={loading || isSubmitting}
							block
							onClick={() => {
								if (shouldFullScreen) {
									document.documentElement?.requestFullscreen();
								}
							}}
						/>
					</Form>
				)}
			</Formik>
		</>
	);
};

LoginForm.defaultProps = {
	submitText: 'Start Session',
	shouldFullScreen: false,
};
