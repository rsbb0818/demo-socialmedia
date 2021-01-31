import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
	const { user } = useContext(AuthContext);
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);
	// Inside this constant, only can be '{data}',
	// instead of 'data: { getPosts: posts }'
	// Otherwise data will be undefined all the time !
	// Also, 'data: { getPosts: posts }={}' won't work.
	// The reason is async data not ready yet here if use 'data: { getPosts: posts }'
	// console.log(data);
	return (
		<Grid columns={3}>
			<Grid.Row className='page-title' id='block'>
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}
				{loading ? (
					<h1>Loading posts..</h1>
				) : (
					<Transition.Group>
						{data &&
							data.getPosts.map((post) => (
								<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
									<PostCard post={post} />
								</Grid.Column>
							))}
					</Transition.Group>
				)}
			</Grid.Row>
		</Grid>
	);
}

export default Home;
