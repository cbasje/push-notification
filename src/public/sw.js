const PUSH_REFRESH = 'pushRefresh';

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
					const pushRefresh = localStorage.getItem(PUSH_REFRESH);
					return fetch('/subscription', {
						method: 'PATCH',
						body: JSON.stringify({
							id: pushRefresh,
							...subscription.toJSON(),
						}),
						headers: {
							'content-type': 'application/json',
						},
					});
				})
		);
	},
	false
);
