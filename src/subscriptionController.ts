import { NextFunction, Request, Response } from 'express';
import * as subscriptionRepository from './subscriptionRepository';
import webpush, { SendResult } from 'web-push';

export const subscribe = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const subscription = req.body;

		const newSubscription = await subscriptionRepository.create({
			endpoint: subscription.endpoint,
			expirationTime: subscription.expirationTime,
			keys: JSON.stringify(subscription.keys),
		});

		// Send 201 - resource created
		res.status(201).json(newSubscription);
	} catch (e) {
		console.error(e);
		next(e);
	}
};

export const renew = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const subscription = req.body;

		const newSubscription = await subscriptionRepository.renew(
			subscription.id,
			{
				endpoint: subscription.endpoint,
				expirationTime: subscription.expirationTime,
				keys: JSON.stringify(subscription.keys),
			}
		);

		// Send 201 - resource created
		res.status(201).json(newSubscription);
	} catch (e) {
		console.error(e);
		next(e);
	}
};

export const remove = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const id: string = req.query.id as string;
		if (!id) {
			res.sendStatus(400);
			return;
		}

		const successful = await subscriptionRepository.deleteById(id);

		if (successful) {
			res.sendStatus(200);
		} else {
			res.sendStatus(500);
		}
	} catch (e) {
		console.error(e);
		next(e);
	}
};

export const broadcast = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const notification = req.body;

	try {
		const subscriptions = await subscriptionRepository.getAll();

		subscriptions.forEach(async (subscription) => {
			console.log(`Sending notification to ${subscription.endpoint}`);

			await webpush
				.sendNotification(
					{
						endpoint: subscription.endpoint,
						keys: subscription.keys,
					},
					JSON.stringify(notification)
				)
				.catch((error) => {
					console.error(error);
				});
		});

		res.sendStatus(200);
	} catch (e) {
		console.error(e);
		next(e);
	}
};
