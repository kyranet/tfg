import { makeKeyFunction } from '../base/Shared';
import type { ViewNotification } from './Notification';

export namespace ViewNotificationOfferAccepted {
	export const Name = 'view_notification_offer_accepted';
	export const Key = makeKeyFunction(Name);

	export interface Value extends ViewNotification.Value<'OfferAccepted'> {}
}
