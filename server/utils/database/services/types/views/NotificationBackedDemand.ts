import { makeKeyFunction } from '../base/Shared';
import type { ViewNotification } from './Notification';

export namespace ViewNotificationBackedDemand {
	export const Name = 'view_notification_demand_backed';
	export const Key = makeKeyFunction(Name);

	export interface Value extends ViewNotification.Value<'DemandBacked'> {}
}
