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

interface IRegisterForm {
	onSubmit: any;
	loading?: boolean;
}

export const RegisterForm = ({ loading, onSubmit }: IRegisterForm) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				login: '',
				password: '',
				machineName: '',
				machineId: '',
				machinePrinterSerialNumber: '',
			},
			Schema: Yup.object().shape({
				login: Yup.string().required().label('Username'),
				password: Yup.string().required().label('Password'),
				machineName: Yup.string().required().max(30).label('Machine name'),
				machineId: Yup.string().required().max(50).label('Machine ID'),
				machinePrinterSerialNumber: Yup.string()
					.required()
					.max(50)
					.label('Machine Printer Serial Number'),
			}),
		}),
		[],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values: IRegisterValues, { resetForm }) => {
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
						<FormInputLabel id="login" label="Admin Username" />
						{errors.login && touched.login ? <FieldError error={errors.login} /> : null}
					</div>

					<div className="input-field">
						<FormInputLabel type="password" id="password" label="Admin Password" />
						{errors.password && touched.password ? <FieldError error={errors.password} /> : null}
					</div>

					<div className="input-field">
						<FormInputLabel type="machineName" id="machineName" label="Machine Name" />
						{errors.machineName && touched.machineName ? (
							<FieldError error={errors.machineName} />
						) : null}
					</div>

					<div className="input-field">
						<FormInputLabel type="machineId" id="machineId" label="Machine ID" />
						{errors.machineId && touched.machineId ? <FieldError error={errors.machineId} /> : null}
					</div>

					<div className="input-field">
						<FormInputLabel
							type="machinePrinterSerialNumber"
							id="machinePrinterSerialNumber"
							label="Machine Printer Serial Number"
						/>
						{errors.machinePrinterSerialNumber && touched.machinePrinterSerialNumber ? (
							<FieldError error={errors.machinePrinterSerialNumber} />
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
