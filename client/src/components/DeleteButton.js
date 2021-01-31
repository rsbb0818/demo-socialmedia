import React, { useState } from 'react';
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { FETCH_POSTS_QUERY } from '../util/graphql';

// import { AuthContext } from '../context/auth';
function DeleteButton({ postId, commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy) {
			if (!commentId) {
				setConfirmOpen(false);
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY,
				});

				data.getPosts = data.getPosts.filter((p) => p.id !== postId);
				proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
			}
			if (callback) callback();
		},
		variables: {
			postId,
			commentId,
		},
	});
	return (
		<>
			<Popup
				content='Trash it!'
				inverted
				trigger={
					<Button
						as='div'
						color='black'
						floated='right'
						onClick={() => setConfirmOpen(true)}>
						<Icon name='trash' style={{ margin: -10 }} />
						{/* {deletePost} */}
					</Button>
				}
			/>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			/>
		</>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default DeleteButton;
