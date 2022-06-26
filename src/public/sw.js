self.addEventListener('push', (event) => {
	let messageData = event.data.json();

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
		console.log(
			'On notification click: ',
			event.notification.tag,
			event.action
		);
		event.notification.close();

		if (!event.action) return;

		// This looks to see if the current is already open and
		// focuses if it is
		event.waitUntil(
			clients
				.matchAll({
					type: 'window',
				})
				.then(function (clientList) {
					for (var i = 0; i < clientList.length; i++) {
						var client = clientList[i];
						if (client.url == '/' && 'focus' in client)
							return client.focus();
					}
					if (clients.openWindow) {
						return clients.openWindow(event.action);
					}
				})
		);
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
