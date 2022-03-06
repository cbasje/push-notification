import { SavedSubscription, Subscription } from './model';
import Airtable from 'airtable';

import dotenv from 'dotenv';
dotenv.config();

// Voor nu even alles opslaan in Airtable, maar het gaat om het idee
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
	'appa2Px7d069LPUut'
);

export const create = async (
	subscription: Subscription
): Promise<SavedSubscription> => {
	const savedSubscription = await base('Table 1').create(subscription);
	console.log(savedSubscription.get('keys'));

	const keys = JSON.parse(savedSubscription.get('keys') as string);
	return {
		id: savedSubscription.getId(),
		endpoint: savedSubscription.get('endpoint') as string,
		expirationTime: savedSubscription.get('expirationTime') as number,
		keys,
	};
};

export const deleteByEndpoint = async (endpoint: string): Promise<boolean> => {
	// const result = await Subscription.remove({ endpoint });
	// return result.ok === 1 && result.deletedCount > 0;
	console.log('Delete');
	return true;
};

export const getAll = async (): Promise<SavedSubscription[]> => {
	const records = await base('Table 1').select({ view: 'Grid view' }).all();
	return records.map((rec) => {
		const keys = JSON.parse(rec.get('keys') as string);
		return {
			id: rec.getId() as string,
			endpoint: rec.get('endpoint') as string,
			expirationTime: rec.get('expirationTime') as number,
			keys,
		};
	});
};
