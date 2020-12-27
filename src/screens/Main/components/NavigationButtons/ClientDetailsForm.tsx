import { Divider } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { FieldError, FormInputLabel } from '../../../../components/elements';
import Button from '../../../../components/elements/Button/Button';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { sleep } from '../../../../utils/function';

interface Props {
	onSubmit: any;
	onClose: any;
}

export const ClientDetailsForm = ({ onSubmit, onClose }: Props) => {
	const { client } = useCurrentTransaction();
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: client?.id || '',
				name: client?.name || '',
				address: client?.address || '',
				tin: client?.tin || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(100).label('Client Name'),
				address: Yup.string().required().max(150).label('Client Address'),
				tin: Yup.string().required().max(50).label('Client TIN'),
			}),
		}),
		[client],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(values);
				resetForm();
			}}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form className="form">
					<div className="input-field">
						<FormInputLabel
							id="name"
							label="Name"
							inputClassname="input-control"
							labelClassname="input-label"
						/>
						{errors.name && touched.name ? <FieldError error={errors.name} /> : null}
					</div>
					<div className="input-field">
						<FormInputLabel
							id="address"
							label="Address"
							inputClassname="input-control"
							labelClassname="input-label"
						/>
						{errors.address && touched.address ? <FieldError error={errors.address} /> : null}
					</div>
					<div className="input-field">
						<FormInputLabel
							id="tin"
							label="TIN"
							inputClassname="input-control"
							labelClassname="input-label"
						/>
						{errors.tin && touched.tin ? <FieldError error={errors.tin} /> : null}
					</div>

					<Divider />

					<div className="custom-footer">
						<Button
							type="button"
							text="Cancel"
							size="lg"
							onClick={onClose}
							classNames="btn-cancel"
							disabled={isSubmitting}
						/>

						<Button
							type="submit"
							text="Submit"
							size="lg"
							variant="primary"
							loading={isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
