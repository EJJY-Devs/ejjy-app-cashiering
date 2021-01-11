import { Divider } from 'antd';
import { Form, Formik } from 'formik';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInput, Label } from '../../../../components/elements';
import { unitOfMeasurementTypes } from '../../../../global/types';
import { sleep } from '../../../../utils/function';

interface Props {
	maxQuantity: number;
	inputRef?: any;
	unitOfMeasurementType: string;
	onSubmit: any;
	onClose: any;
}

export const EditProductForm = ({
	unitOfMeasurementType,
	maxQuantity,
	inputRef,
	onSubmit,
	onClose,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				quantity: '',
			},
			Schema: Yup.object().shape({
				quantity: Yup.number()
					.required()
					.moreThan(0)
					.max(maxQuantity, 'Insufficient balance.')
					.test('is-whole-number', 'Non-weighing items require whole number quantity.', (value) => {
						if (unitOfMeasurementType === unitOfMeasurementTypes.NON_WEIGHING) {
							return isInteger(Number(value));
						}

						return true;
					})
					.label('Quantity'),
			}),
		}),
		[unitOfMeasurementType, maxQuantity],
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
					<Label classNames="quantity-label" id="quantity" label="New Quantity" spacing />
					<FormInput
						id="quantity"
						inputRef={inputRef}
						type="number"
						classNames="quantity-input"
						step=".001"
						autoFocus
					/>
					{errors.quantity && touched.quantity ? <FieldError error={errors.quantity} /> : null}

					<Divider />

					<div className="custom-footer">
						<Button
							type="button"
							text={
								<>
									<span>Cancel</span>
									<span className="shortcut-key">[ESC]</span>
								</>
							}
							size="lg"
							onClick={onClose}
							classNames="btn-cancel"
							disabled={isSubmitting}
							hasShortcutKey
						/>
						<Button
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
