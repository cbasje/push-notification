import { FieldSet } from 'airtable';

export interface Subscription extends FieldSet {
	endpoint: string;
	expirationTime?: number;
	keys: string;
}

export interface SavedSubscription {
	id: string;
	endpoint: string;
	expirationTime?: number;
	keys: {
		auth: string;
		p256dh: string;
	};
}
