import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Register(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	// useForm is used of hooks
	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: '',
		password: '',
		confirmPassword: '',
		email: '',
	});

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(_, { data: { register: userData } }) {
			context.login(userData);
			// '_' used to be 'proxy'
			// console.log(result);
			props.history.push('/');
			// Return to homepage once registered successfully
		},
		// When register meets errors
		// Return the error message from server
		onError(err) {
			// console.log(err.graphQLErrors[0].extensions.exception.errors);
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	function registerUser() {
		addUser();
	}

	return (
		<div className='form-container'>
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Register</h1>
				{/* Username */}
				<Form.Input
					label='Username'
					placeholder='Enter username'
					name='username'
					type='text'
					value={values.username}
					error={errors.username ? true : false}
					onChange={onChange}
				/>
				{/* Password */}
				<Form.Input
					label='Password'
					placeholder='Enter password'
					name='password'
					type='password'
					value={values.password}
					error={errors.password ? true : false}
					onChange={onChange}
				/>
				{/* Confirm Password */}
				<Form.Input
					label='Confirm Password'
					placeholder='Enter password twice here'
					name='confirmPassword'
					type='Password'
					value={values.confirmPassword}
					error={errors.confirmpassword ? true : false}
					onChange={onChange}
				/>
				{/* email */}
				<Form.Input
					label='Email'
					placeholder='Enter email'
					name='email'
					type='email'
					value={values.email}
					error={errors.email ? true : false}
					onChange={onChange}
				/>

				<Button type='submit' primary>
					Register
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && (
				<div className='ui error message'>
					<ui className='list'>
						{Object.values(errors).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ui>
				</div>
			)}
		</div>
	);
}

// As input user infor above it needs to submit to muatation immediately
const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			username
			email
			createdAt
			token
		}
	}
`;

export default Register;
