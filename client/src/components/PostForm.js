import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
	// Create values for returning
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: '',
	});

	// 'Create a post' function uses mutation
	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		// onError() {},
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});

			// All the cache will stay inside of this data variable
			data.getPosts = [result.data.createPost, ...data.getPosts];
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data,
			});
			values.body = '';
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder='create a post'
						name='body'
						onChange={onChange}
						value={values.body}
						error={error ? true : false}
					/>
					<Button type='submit' color='red'>
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className='ui error message' style={{ marginBottom: 20 }}>
					<ul className='list'>
						<li>{error.graphQLErrors[0].message}</li>
						{/* TODO: Submit trigger here caused error */}
					</ul>
				</div>
			)}
		</>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

export default PostForm;
