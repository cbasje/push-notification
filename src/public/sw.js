self.addEventListener('push', (e) => {
	const data = e.data.json();
	self.registration.showNotification(data.title, {
		body: data.body,
		icon: '/favicon.ico',
		image: data.image,
		tag: data.tag,
		data: data.url,
	});
});

self.addEventListener(
	'notificationclick',
	function (event) {
		console.log('On notification click: ', event.notification.tag);
		event.notification.close();
		if (clients.openWindow) {
			// clients.openWindow('http://www.mozilla.org');
			clients.openWindow(event.notification.data);
		}
	},
	false
);
