const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
	Post: {
		// Either normal function n arrow function,
		// If set parameter like this:
		//  'likeCount(parent){
		//	  console.log(parent);
		//    return parent.likes.length; }'
		// The data will comes from Post, it needs go through the whole modifiyer to add the properties.
		likeCount: (parent) => parent.likes.length,
		commentCount: (parent) => parent.comments.length,
	},

	Query: {
		...postsResolvers.Query,
	},

	Mutation: {
		...usersResolvers.Mutation,
		...postsResolvers.Mutation,
		...commentsResolvers.Mutation,
	},

	Subscription: {
		...postsResolvers.Subscription,
	},
};
