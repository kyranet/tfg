import type { ViewServiceOffer } from '../../types/views/ServiceOffer';

export function parseViewServiceOfferJsonStringProperties(value: ViewServiceOffer.RawValue): ViewServiceOffer.Value {
	return {
		...value,
		services: JSON.parse(value.services),
		subjects: JSON.parse(value.subjects),
		tags: JSON.parse(value.tags),
		creator: JSON.parse(value.creator),
		professors: JSON.parse(value.professors)
	};
}
