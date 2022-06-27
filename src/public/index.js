// Check if service workers are supported
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js', {
		scope: '/',
	});
}

const PUSH_REFRESH = 'pushRefresh';
const PUBLIC_VAPID_KEY =
	'BNodLgNO2YdnKllWbx8oxTOQqr9J0jh5IvQ1lfI5Wgsfdt8p-RXpZ5T6qRQFjNmYnJ7uPFQEI9v0eQ06nCYsRGg';

let isPushAvailable = false;

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

const form = document.getElementById('form');
const buttons = document.getElementById('buttons');
const notAvailableElement = document.getElementById('not-available');

const subscribeButton = document.getElementById('subscribe');
const unsubscribeButton = document.getElementById('unsubscribe');

const titleInput = document.getElementById('title');
const messageInput = document.getElementById('message');
const urlInput = document.getElementById('url');

const checkPushAvailability = async () => {
	const registration = await navigator.serviceWorker.ready.catch((err) => {
		console.error('Registration: ', err);
	});

	if (!registration.pushManager) {
		return false;
	}
	return true;
};

const checkNotificationSubscription = async () => {
	if (!isPushAvailable) {
		notAvailableElement.setAttribute('style', 'display: block');
		buttons.setAttribute('style', 'display: none');
		return;
	}

	const registration = await navigator.serviceWorker.ready.catch((err) => {
		console.error('Registration: ', err);
	});

	const pushRefresh = localStorage.getItem(PUSH_REFRESH);
	const existingSubscription = await registration.pushManager
		.getSubscription()
		.catch((err) => {
			console.error('Existing subscription: ', err);
		});

	if (pushRefresh !== undefined && pushRefresh !== null) {
		let response;

		if (existingSubscription) {
			response = await fetch('/subscription', {
				method: 'PATCH',
				body: JSON.stringify({
					id: pushRefresh,
					...existingSubscription.toJSON(),
				}),
				headers: {
					'content-type': 'application/json',
				},
			});
		} else {
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
			});

			response = await fetch('/subscription', {
				method: 'PATCH',
				body: JSON.stringify({
					id: pushRefresh,
					...subscription.toJSON(),
				}),
				headers: {
					'content-type': 'application/json',
				},
			});
		}

		if (response.ok) {
			console.log('Subscription renewed');
		}
	}
};

const main = async () => {
	isPushAvailable = await checkPushAvailability();
	await checkNotificationSubscription();
};
main();

const subscribe = async () => {
	const pushRefresh = localStorage.getItem(PUSH_REFRESH);
	if (!('serviceWorker' in navigator) || pushRefresh) return;

	const registration = await navigator.serviceWorker.ready.catch((err) => {
		console.error('Registration: ', err);
	});

	try {
		// Subscribe to push notifications
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
		});

		const response = await fetch('/subscription', {
			method: 'POST',
			body: JSON.stringify(subscription),
			headers: {
				'content-type': 'application/json',
			},
		});
		console.log('Subscription response: ', response);

		if (response.ok) {
			const data = await response.json();
			localStorage.setItem(PUSH_REFRESH, data.id);
		}
	} catch (err) {
		console.error('Subscribing...: ', err);
	}
};
subscribeButton.onclick = subscribe;

const unsubscribe = async () => {
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
		const pushRefresh = localStorage.getItem(PUSH_REFRESH);
		const response = await fetch(`/subscription?refreshId=${pushRefresh}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
			},
		});

		if (response.ok) {
			await subscription.unsubscribe();
			localStorage.removeItem(PUSH_REFRESH);
		}
	} catch (err) {
		console.error('Unsubscribing...: ', err);
	}
};
unsubscribeButton.onclick = unsubscribe;

const broadcast = async () => {
	await fetch('/broadcast', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			tag: 'csr-notification-123',
			title: titleInput.value,
			body: messageInput.value,
			image: 'https://push-notifications-cbasje.herokuapp.com/image.jpeg',
			url: urlInput.value,
		}),
	});
};
form.onsubmit = (e) => {
	e.preventDefault();
	broadcast();
};
