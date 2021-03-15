import * as React from 'react';
import { useFormik } from 'formik';
import styles from './LoginForm.module.scss';
import * as Yup from 'yup';
import CSS from 'csstype';
import { UserErrors } from '../redux/user-slice';

const buttonStyles: CSS.Properties = {
	color: '#ddd9da',
	border: 'none',
	background: 'none',
	fontSize: '24px',
};

const submitButton: CSS.Properties = {
	background: '#6f3473',
	border: 'none',
	color: 'white',
	fontSize: '24px',
	marginTop: '16px',
	padding: '8px',
};

interface RegisterFormValues {
	email: string;
	username: string;
	password: string;
}

type IProps = {
	closeModal: () => void;
	onSubmit: (user: RegisterFormValues) => void;
	errors: UserErrors;
};

export const RegisterForm = (props: IProps): JSX.Element => {
	const initialValues: RegisterFormValues = {
		email: '',
		username: '',
		password: '',
	};

	const LoginSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Required'),
		username: Yup.string()
			.trim()
			.min(5, 'username must have at least 5 characters')
			.max(20, 'max username length is 20 characters')
			.matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric')
			.required('Required'),
		password: Yup.string()
			.min(8, 'Password must have a length of at least 8')
			.required('Required'),
	});

	const formik = useFormik({
		initialValues: initialValues,
		onSubmit: async (
			values: RegisterFormValues,
			{ setSubmitting, setStatus }
		) => {
			setSubmitting(true);
			const errors = await props.onSubmit(values);
			setStatus(errors);
			setSubmitting(false);
		},
		validationSchema: LoginSchema,
	});

	return (
		<div>
			<div className={styles.header}>
				<h1>Register</h1>
				<button
					style={buttonStyles}
					className={styles.closeModal}
					onClick={props.closeModal}
				>
					&times;
				</button>
			</div>

			<form className={styles.form} onSubmit={formik.handleSubmit}>
				<input
					className={styles.input}
					type='text'
					name='email'
					placeholder='e-mail'
					onChange={formik.handleChange}
					value={formik.values.email}
				/>
				{formik.status && formik.status.email ? (
					<p id='emailError' className={styles.error}>
						{formik.status.email}
					</p>
				) : (
					formik.errors.email &&
					formik.touched.email && (
						<p id='emailError' className={styles.error}>
							{formik.errors.email}
						</p>
					)
				)}
				<input
					className={styles.input}
					type='text'
					name='username'
					placeholder='username'
					onChange={formik.handleChange}
					value={formik.values.username}
				/>
				{formik.status && formik.status.username ? (
					<p id='usernameError' className={styles.error}>
						{formik.status.username}
					</p>
				) : (
					formik.errors.username &&
					formik.touched.username && (
						<p id='usernameError' className={styles.error}>
							{formik.errors.username}
						</p>
					)
				)}
				<input
					className={styles.input}
					type='password'
					name='password'
					placeholder='password'
					onChange={formik.handleChange}
					value={formik.values.password}
				/>
				{formik.status && formik.status.password ? (
					<p id='passwordError' className={styles.error}>
						{formik.status.password}
					</p>
				) : (
					formik.errors.password &&
					formik.touched.password && (
						<p id='passwordError' className={styles.error}>
							{formik.errors.password}
						</p>
					)
				)}
				<button
					data-testid='submitButton'
					id='submit'
					style={submitButton}
					type='submit'
					disabled={formik.isSubmitting}
				>
					Register
				</button>
			</form>
		</div>
	);
};
