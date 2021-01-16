import { Divider } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel } from '../../../../components/elements';
import { userTypes } from '../../../../global/types';
import { sleep } from '../../../../utils/function';

interface Props {
	currentPrice: number;
	overallDiscount: number;
	usernameRef: any;
	passwordRef: any;
	discountRef: any;
	btnSubmitRef: any;
	btnCancelRef: any;
	onSubmit: any;
	onClose: any;
}

export const DiscountAmountForm = ({
	currentPrice,
	overallDiscount,
	usernameRef,
	passwordRef,
	discountRef,
	btnSubmitRef,
	btnCancelRef,
	onSubmit,
	onClose,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				userType: userTypes.BRANCH_MANAGER,
				login: '',
				password: '',
				discount: overallDiscount || '',
			},
			Schema: Yup.object().shape({
				login: Yup.string().required().label('Username'),
				password: Yup.string().required().label('Password'),
				discount: Yup.number().required().moreThan(0).lessThan(currentPrice).label('Discount'),
			}),
		}),
		[currentPrice, overallDiscount],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(values);
			}}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form className="form">
					<div className="input-field">
						<FormInputLabel
							inputRef={discountRef}
							type="number"
							id="discount"
							label="Discount"
							inputClassname="input-control input-quantity"
							labelClassname="input-label"
						/>
						{errors.discount && touched.discount ? <FieldError error={errors.discount} /> : null}
					</div>

					<div className="input-field">
						<FormInputLabel
							inputRef={usernameRef}
							id="login"
							label="Manager's Username"
							inputClassname="input-control"
							labelClassname="input-label"
						/>
						{errors.login && touched.login ? <FieldError error={errors.login} /> : null}
					</div>
					<div className="input-field">
						<FormInputLabel
							inputRef={passwordRef}
							type="password"
							id="password"
							label="Manager's Password"
							inputClassname="input-control"
							labelClassname="input-label"
						/>
						{errors.password && touched.password ? <FieldError error={errors.password} /> : null}
					</div>

					<Divider />

					<div className="custom-footer">
						<Button
							ref={btnCancelRef}
							type="button"
							text={
								<>
									<span>Cancel</span>
									<span className="shortcut-key">[ESC]</span>
								</>
							}
							size="lg"
							onClick={onClose}
							classNames="space-right"
							disabled={isSubmitting}
							hasShortcutKey
						/>
						<Button
							ref={btnSubmitRef}
							type="submit"
							text={
								<>
									<span>Submit</span>
									<span className="shortcut-key">[ENTER]</span>
								</>
							}
							size="lg"
							variant="primary"
							loading={isSubmitting}
							hasShortcutKey
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
