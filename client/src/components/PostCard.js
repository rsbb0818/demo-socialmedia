import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Label, Image, Button, Popup } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

function PostCard({
	post: { id, username, body, createdAt, likeCount, likes, commentCount },
}) {
	const { user } = useContext(AuthContext);

	function commentPost() {
		console.log('Commented post!');
	}

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated='right'
					size='mini'
					src='https://banner2.cleanpng.com/20180626/fhs/kisspng-avatar-user-computer-icons-software-developer-5b327cc98b5780.5684824215300354015708.jpg'
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow(true)}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				{/* Like Button */}
				<LikeButton user={user} post={{ id, likes, likeCount }} />

				{/* Comment button */}
				<Popup
					content='Comment it!'
					inverted
					trigger={
						<Button as='div' labelPosition='right' onClick={commentPost}>
							<Button color='blue' basic>
								<Icon name='comments' style={{ margin: 0 }} />
							</Button>
							<Label as='a' basic color='blue' pointing='left'>
								{commentCount}
							</Label>
						</Button>
					}
				/>
				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	);
}

export default PostCard;
