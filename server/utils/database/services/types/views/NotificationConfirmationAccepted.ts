import { makeKeyFunction } from '../base/Shared';
import type { ViewNotification } from './Notification';

export namespace ViewNotificationConfirmationAccepted {
	export const Name = 'view_notification_confirmation_accepted';
	export const Key = makeKeyFunction(Name);

	export interface Value extends ViewNotification.Value<'ConfirmationAccepted'> {}
}
