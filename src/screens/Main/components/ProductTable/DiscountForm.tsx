import { Divider } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel } from '../../../../components/elements';
import { sleep, numberWithCommas } from '../../../../utils/function';
import { userTypes } from '../../../../global/types';

interface Props {
	maxQuantity: number;
	onSubmit: any;
}

export const DiscountForm = ({ maxQuantity, onSubmit }: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				userType: userTypes.BRANCH_MANAGER,
				login: '',
				password: '',
				discount: '',
			},
			Schema: Yup.object().shape({
				login: Yup.string().required().label('Username'),
				password: Yup.string().required().label('Password'),
				discount: Yup.number()
					.required()
					.min(1)
					.max(
						maxQuantity,
						`Must not be greater than the original price (₱${numberWithCommas(
							maxQuantity.toFixed(2),
						)}).`,
					)
					.label('Discount'),
			}),
		}),
		[maxQuantity],
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
							id="login"
							label="Username"
							inputClassname="input-control"
							labelClassname="input-label"
						/>
						{errors.login && touched.login ? <FieldError error={errors.login} /> : null}
					</div>
					<div className="input-field">
						<FormInputLabel
							type="password"
							id="password"
							label="Password"
							inputClassname="input-control"
							labelClassname="input-label"
						/>
						{errors.password && touched.password ? <FieldError error={errors.password} /> : null}
					</div>
					<div className="input-field">
						<FormInputLabel
							type="number"
							id="discount"
							label="Discount"
							inputClassname="input-control"
							labelClassname="input-label"
						/>
						{errors.discount && touched.discount ? <FieldError error={errors.discount} /> : null}
					</div>

					<Divider />

					<Button type="submit" text="Submit" size="lg" variant="primary" loading={isSubmitting} />
				</Form>
			)}
		</Formik>
	);
};
