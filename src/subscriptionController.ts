import { NextFunction, Request, Response } from 'express';
import * as subscriptionRepository from './subscriptionRepository';
import webpush, { SendResult } from 'web-push';

export const post = async (
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
		next(e);
		res.sendStatus(500);
	}
};

export const remove = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const endpoint: string = req.query.endpoint as string;
		if (!endpoint) {
			res.sendStatus(400);
			return;
		}

		const successful = await subscriptionRepository.deleteByEndpoint(
			endpoint
		);

		if (successful) {
			res.sendStatus(200);
		} else {
			res.sendStatus(500);
		}
	} catch (e) {
		next(e);
		res.sendStatus(500);
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
		next(e);
		console.error(e);

		res.sendStatus(500);
	}
};
