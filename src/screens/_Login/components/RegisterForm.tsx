/* eslint-disable react-hooks/exhaustive-deps */
import { Spin } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel, FormSelectLabel } from '../../../components/elements';
import { types } from '../../../ducks/branch-machines';
import { request } from '../../../global/types';
import { useBranchMachines } from '../../../hooks/useBranchMachines';
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
	// STATES
	const [branchMachinesOptions, setBranchMachinesOptions] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// CUSTOM HOOKS
	const { branchMachines, getBranchMachines, status, recentRequest } = useBranchMachines();

	// METHODS
	useEffect(() => {
		getBranchMachines();
	}, []);

	useEffect(() => {
		if (status === request.SUCCESS && recentRequest === types.GET_BRANCH_MACHINES) {
			const formattedBranchMachines = branchMachines.map(({ name }) => ({
				name,
				value: name,
			}));

			setBranchMachinesOptions(formattedBranchMachines);
		}
	}, [branchMachines, status, recentRequest]);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				login: '',
				password: '',
				machineName: branchMachines?.[0]?.name,
				machineId: '',
				machinePrinterSerialNumber: '',
			},
			Schema: Yup.object().shape({
				login: Yup.string().required().label('Username'),
				password: Yup.string().required().label('Password'),
				machineName: Yup.string().required().label('Machine name'),
				machineId: Yup.string().required().max(50).label('Machine ID'),
				machinePrinterSerialNumber: Yup.string()
					.required()
					.max(50)
					.label('Machine Printer Serial Number'),
			}),
		}),
		[branchMachines],
	);

	return (
		<Spin size="large" spinning={status === request.REQUESTING}>
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
							<FormSelectLabel
								id="machineName"
								label="Machine Name"
								options={branchMachinesOptions}
							/>
							{errors.machineName && touched.machineName ? (
								<FieldError error={errors.machineName} />
							) : null}
						</div>

						<div className="input-field">
							<FormInputLabel id="machineId" label="Machine ID" />
							{errors.machineId && touched.machineId ? (
								<FieldError error={errors.machineId} />
							) : null}
						</div>

						<div className="input-field">
							<FormInputLabel
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
		</Spin>
	);
};
