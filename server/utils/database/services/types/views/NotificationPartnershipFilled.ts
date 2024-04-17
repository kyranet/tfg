import { makeKeyFunction } from '../base/Shared';
import type { ViewNotification } from './Notification';

export namespace ViewNotificationPartnershipFilled {
	export const Name = 'view_notification_partnership_filled';
	export const Key = makeKeyFunction(Name);

	export interface Value extends ViewNotification.Value<'PartnershipFilled'> {}
}
