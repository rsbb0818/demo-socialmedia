const { UserInputError, AuthenticationError } = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');

module.exports = {
	Mutation: {
		createComment: async (_, { postId, body }, context) => {
			// context here ensures the user has loged in
			const { username } = checkAuth(context);
			if (body.trim() === '') {
				throw new UserInputError('Comment requires content!', {
					errors: {
						body: 'Comment cannot be empty!',
					},
				});
			}

			const post = await Post.findById(postId);
			if (post) {
				post.comments.unshift({
					body,
					username,
					createdAt: new Date().toISOString(),
				});
				await post.save();
				return post;
			} else throw new UserInputError('Cannot find this post');
		},
		async deleteComment(_, { postId, commentId }, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);

			if (post) {
				const commentIndex = post.comments.findIndex((c) => c.id === commentId);

				if (post.comments[commentIndex].username === username) {
					post.comments.splice(commentIndex, 1);
					await post.save();
					return post;
				} else {
					throw new AuthenticationError(
						'It is your comment. Cannot remove it!'
					);
				}
			} else {
				throw new UserInputError('Post was not found');
			}
		},
	},
};
