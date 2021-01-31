import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Icon, Label, Button } from 'semantic-ui-react';

function LikeButton({ user, post: { id, likeCount, likes } }) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else setLiked(false);
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	});

	const likeButton = user ? (
		liked ? (
			<Button color='red'>
				<Icon name='heart' style={{ margin: -10 }} />
			</Button>
		) : (
			<Button color='red' basic>
				<Icon name='heart' style={{ margin: -10 }} />
			</Button>
		)
	) : (
		<Button as={Link} to='/login' color='brown' basic>
			<Icon name='heart' style={{ margin: -10 }} />
		</Button>
	);

	return (
		<Button as='div' labelPosition='right' onClick={likePost}>
			{likeButton}
			<Label as='a' basic color='red' pointing='left'>
				{likeCount}
			</Label>
		</Button>
	);
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;
