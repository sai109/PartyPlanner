import reducer, {
	setUsername,
	setId,
	setToken,
	setErrors,
	registerUser,
	loginUser,
	initialState,
} from '../../redux/user-slice';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('Test user slice', () => {
	it('should have correct initial state', () => {
		const state = reducer(undefined, { type: '' });

		expect(state).toEqual(initialState);
	});

	it('should set id correctly', () => {
		const state = reducer(undefined, setId('test'));
		expect(state.id).toBe('test');
	});

	it('should set username correctly', () => {
		const state = reducer(undefined, setUsername('test'));
		expect(state.userName).toBe('test');
	});

	it('should set token correctly', () => {
		const state = reducer(undefined, setToken('test'));
		expect(state.token).toBe('test');
	});

	it('should set errors correctly', () => {
		const exampleErrors = {
			email: 'invalid email',
			username: 'username is taken',
		};
		const state = reducer(undefined, setErrors(exampleErrors));
		expect(state.errors).toBe(exampleErrors);
	});

	it('should handle set state correctly if registered user correctly', async () => {
		mockAxios.post.mockImplementationOnce(() => {
			return Promise.resolve({
				data: {
					userName: 'test',
					id: '123456',
				},
			});
		});

		const newUser = {
			email: 'test@example.com',
			username: 'test',
			password: '123456dfdFD',
		};

		const store = configureStore({ reducer: reducer });
		await store.dispatch(registerUser(newUser));
		const state = store.getState();
		expect(state.userName).toBe('test');
		expect(state.id).toBe('123456');
	});

	it('should handle register user error correctly', async () => {
		const errors = {
			email: 'email invalid',
		};

		mockAxios.post.mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					data: {
						...errors,
					},
				},
			});
		});

		const newUser = {
			email: 'test@example.com',
			username: 'test',
			password: '123456dfdFD',
		};

		const store = configureStore({ reducer: reducer });
		await store.dispatch(registerUser(newUser));
		const state = store.getState();
		expect(state.errors).toEqual(errors);
	});

	it('should handle set state correctly if login user correctly', async () => {
		const data = {
			token: 'Bearer 1234456789',
			id: '123456',
		};

		mockAxios.post.mockImplementationOnce(() => {
			return Promise.resolve({
				data: {
					...data,
				},
			});
		});

		const newUser = {
			email: 'test@example.com',
			password: '123456dfdFD',
		};

		const store = configureStore({ reducer: reducer });
		await store.dispatch(loginUser(newUser));
		const state = store.getState();
		expect(state.token).toBe(data.token);
		expect(state.id).toBe(data.id);
	});

	it('should handle login user error correctly', async () => {
		const errors = {
			email: 'email invalid',
			password: 'password is incorrect',
		};

		mockAxios.post.mockImplementationOnce(() => {
			return Promise.reject({
				response: {
					data: {
						...errors,
					},
				},
			});
		});

		const newUser = {
			email: 'test@example.com',
			password: '123456dfdFD',
		};

		const store = configureStore({ reducer: reducer });
		await store.dispatch(loginUser(newUser));
		const state = store.getState();
		expect(state.errors).toEqual(errors);
	});
});
