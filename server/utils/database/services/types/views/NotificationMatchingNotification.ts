import { makeKeyFunction } from '../base/Shared';
import type { ViewNotification } from './Notification';

export namespace ViewNotificationMatchingNotification {
	export const Name = 'view_notification_matching_notification';
	export const Key = makeKeyFunction(Name);

	export interface Value extends ViewNotification.Value<'MatchingNotification'> {}
}
