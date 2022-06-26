self.addEventListener('push', (event) => {
	let messageData = e.data.json();

	event.waitUntil(
		self.registration.showNotification(messageData.title, {
			tag: messageData.tag,
			body: messageData.body,
			icon: '/favicon.ico',
			image: messageData.image,
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
		if (!event.action) return;

		if (clients.openWindow) {
			// This always opens a new browser tab,
			// even if the URL happens to already be open in a tab.
			clients.openWindow(event.action);
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
