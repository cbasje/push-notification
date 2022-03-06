import webpush from 'web-push';

const publicVapidKey =
	'BNodLgNO2YdnKllWbx8oxTOQqr9J0jh5IvQ1lfI5Wgsfdt8p-RXpZ5T6qRQFjNmYnJ7uPFQEI9v0eQ06nCYsRGg';
const privateVapidKey = '6QdJDETcKf_QG6R6Z6VgqHxE9mQvgd2WXCc0tIfrrUo';

export default (): void => {
	webpush.setVapidDetails(
		'mailto:sebastiaan@benjami.in',
		publicVapidKey,
		privateVapidKey
	);
};
