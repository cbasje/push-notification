self.addEventListener('push', (event) => {
	let messageData = event.data.json();

	event.waitUntil(
		self.registration.showNotification(messageData.title, {
			tag: messageData.tag,
			body: messageData.body,
			icon: '/favicon.ico',
			image: messageData.image,
			data: messageData.url,
			actions: [
				{
					action: messageData.url,
					title: 'Open url',
				},
			],
		})
	);
});

self.addEventListener(
	'notificationclick',
	async function (event) {
		console.log(
			'On notification click: ',
			event.notification.tag,
			event.action
		);
		event.notification.close();

		if (clients.openWindow) {
			if (event.action) {
				// User selected an action.
				clients.openWindow(event.action);
			} else {
				// User selected (e.g., clicked in) the main body of notification.
				clients.openWindow(event.notification.data);
			}
		}
	},
	false
);

self.addEventListener(
	'pushsubscriptionchange',
	(event) => {
		event.waitUntil(
			swRegistration.pushManager
				.subscribe(event.oldSubscription.options)
				.then((subscription) => {
					return fetch('/subscription', {
						method: 'POST',
						body: JSON.stringify(subscription),
						headers: {
							'content-type': 'application/json',
						},
					});
				})
		);
	},
	false
);
