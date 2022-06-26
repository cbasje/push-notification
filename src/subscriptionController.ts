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
	}
};

export const broadcast = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const notification = req.body;

		const subscriptions = await subscriptionRepository.getAll();

		const notifications: Promise<SendResult>[] = [];

		subscriptions.forEach(async (subscription) => {
			notifications.push(
				webpush.sendNotification(
					{
						endpoint: subscription.endpoint,
						keys: subscription.keys,
					},
					JSON.stringify(notification)
				)
			);
		});

		await Promise.all(notifications);
		res.sendStatus(200);
	} catch (e) {
		next(e);
		console.error(e);
	}
};
