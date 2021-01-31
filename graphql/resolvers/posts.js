const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
	Query: {
		async getPosts() {
			console.log('getPosts'); // This is for display queries in server side, same as in the following resolvers
			// Display all posts
			try {
				const posts = await Post.find().sort({ createdAt: -1 }); // Descending order
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getPost(_, { postId }) {
			console.log('getPostByID');
			// Search post by ID
			try {
				const post = await Post.findById(postId);
				if (post) {
					return post;
				} else {
					throw new Error('Post not found!');
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	}, // Query ends
	// Here can be done wrong easily, do NOT put Mutation in Query

	Mutation: {
		// --- --- createPost --- ---
		async createPost(_, { body }, context) {
			console.log('createPost');
			// Here is the context body been accessed via index.js where forward req body to context

			const user = checkAuth(context);
			// If there is no error been thrown which means this is working functionally
			// console.log(user);
			if (body.trim() === '') {
				throw new Error('Post must been filled!');
			}

			const newPost = new Post({
				body,
				user: user.id,
				username: user.username,
				createdAt: new Date().toISOString(),
			});

			const post = await newPost.save();

			context.pubsub.publish('NEW_POST', { newPost: post });

			return post;
		}, // createPost ends

		// --- --- Deletion --- ---
		async deletePost(_, { postId }, context) {
			console.log('deletePost');
			const user = checkAuth(context);

			try {
				const post = await Post.findById(postId);
				if (user.username === post.username) {
					await post.delete();
					return 'Post deletion excuted successfully!';
				} else {
					throw new AuthenticationError(
						'Post deletion cannot be done due to unknown authority!'
					);
				}
			} catch (err) {
				throw new Error(err);
			}
		}, // deletePost ends

		// --- --- Like Function --- ---
		async likePost(_, { postId }, context) {
			console.log('likePost');
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);
			if (post) {
				if (post.likes.find((like) => like.username === username)) {
					// Unlike liked post
					post.likes = post.likes.filter((like) => like.username !== username);
				} else {
					// like unliked post
					post.likes.push({
						username,
						createdAt: new Date().toISOString(),
					});
				}

				await post.save();
				return post;
			} else throw new UserInputError('Post was not found');
		}, // likePost Ends
	}, // Mutation Ends

	Subscription: {
		newPost: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'), // ??
		},
	}, // subscription ends
};
