import db from './db/rds';

// This example demonstrates a NodeJS 8.10 async handler[1], however of course you could use
// the more traditional callback-style handler.
// [1]: https://aws.amazon.com/blogs/compute/node-js-8-10-runtime-now-available-in-aws-lambda/
export default async (event): Promise<any> => {
	try {
		// console.log('input', JSON.stringify(event));
		const reviewId = event.pathParameters && event.pathParameters.proxy;
		// console.log('getting stats for review', reviewId);
		const mysql = await db.getConnection();
		const results = await mysql.query(
			`
			SELECT * FROM match_stats 
			WHERE reviewId = '${reviewId}'
		`,
		);
		await mysql.end();
		const response = {
			statusCode: 200,
			isBase64Encoded: false,
			body: JSON.stringify({ results }),
		};
		// console.log('sending back success reponse');
		return response;
	} catch (e) {
		console.error('issue retrieving stats', e);
		const response = {
			statusCode: 500,
			isBase64Encoded: false,
			body: JSON.stringify({ message: 'not ok', exception: e }),
		};
		console.log('sending back error reponse', response);
		return response;
	}
};
