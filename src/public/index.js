// Check if service workers are supported
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js', {
		scope: '/',
	});
}

const publicVapidKey =
	'BNodLgNO2YdnKllWbx8oxTOQqr9J0jh5IvQ1lfI5Wgsfdt8p-RXpZ5T6qRQFjNmYnJ7uPFQEI9v0eQ06nCYsRGg';

const urlBase64ToUint8Array = (base64String) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};

const subscribedElement = document.getElementById('subscribed');
const unsubscribedElement = document.getElementById('unsubscribed');
const notAvailableElement = document.getElementById('not-available');

const titleInput = document.getElementById('title');
const messageInput = document.getElementById('message');
const urlInput = document.getElementById('url');

const setSubscribeMessage = async () => {
	const registration = await navigator.serviceWorker.ready.catch((err) => {
		console.error('Registration: ', err);
	});

	if (!registration.pushManager) {
		notAvailableElement.setAttribute('style', 'display: block');
		subscribedElement.setAttribute('style', 'display: none');
		unsubscribedElement.setAttribute('style', 'display: none');
		return;
	}

	const subscription = await registration.pushManager
		.getSubscription()
		.catch((err) => {
			console.error('Subscription: ', err);
		});

	notAvailableElement.setAttribute('style', 'display: none');
	subscribedElement.setAttribute(
		'style',
		`display: ${subscription ? 'block' : 'none'};`
	);
	unsubscribedElement.setAttribute(
		'style',
		`display: ${subscription ? 'none' : 'block'};`
	);
};

window.subscribe = async () => {
	if (!('serviceWorker' in navigator)) return;

	const registration = await navigator.serviceWorker.ready.catch((err) => {
		console.error('Registration: ', err);
	});

	const existingSubscription = await registration.pushManager
		.getSubscription()
		.catch((err) => {
			console.error('existingSubscription: ', err);
		});

	if (existingSubscription) {
		setSubscribeMessage();
		return;
	}

	try {
		// Subscribe to push notifications
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
		});

		const response = await fetch('/subscription', {
			method: 'POST',
			body: JSON.stringify(subscription),
			headers: {
				'content-type': 'application/json',
			},
		});

		if (response.ok) {
			setSubscribeMessage();
		}
	} catch (err) {
		console.error('Subscribing...: ', err);
	}
};

window.unsubscribe = async () => {
	const registration = await navigator.serviceWorker.ready.catch((err) => {
		console.error('Registration: ', err);
	});
	const subscription = await registration.pushManager
		.getSubscription()
		.catch((err) => {
			console.error('Subscription: ', err);
		});

	if (!subscription) return;

	try {
		const { endpoint } = subscription;
		const response = await fetch(`/subscription?endpoint=${endpoint}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
			},
		});

		if (response.ok) {
			await subscription.unsubscribe();
			setSubscribeMessage();
		}
	} catch (err) {
		console.error('Unsubscribing...: ', err);
	}
};

window.broadcast = async () => {
	await fetch('/broadcast', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			tag: 'csr-notification-123',
			title: titleInput.value,
			body: messageInput.value,
			image: '/image.jpeg',
			url: urlInput.value,
		}),
	});
};

setSubscribeMessage();
