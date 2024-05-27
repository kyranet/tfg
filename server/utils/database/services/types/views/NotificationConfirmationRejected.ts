import { makeKeyFunction } from '../base/Shared';
import type { ViewNotification } from './Notification';

export namespace ViewNotificationConfirmationRejected {
	export const Name = 'view_notification_confirmation_rejected';
	export const Key = makeKeyFunction(Name);

	export interface Value extends ViewNotification.Value<'ConfirmationRejected'> {}
}
