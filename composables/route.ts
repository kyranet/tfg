export function useRouteNumber(key: string) {
	const route = useRoute();
	const number = route.params[key];
	if (number === undefined) {
		throw new Error(`Route number not found: ${key}`);
	}

	return Number(number);
}

/**
 * Returns the route **without changes**, but the type is updated replacing all route parameters with `**:id`, so it can
 * be used in the `useFetch` composable without Nuxt's types mixing up certain routes.
 *
 * Without this function, the `useFetch` composable would not be able to infer the correct type for the route, as it
 * would match, e.g., `/users/${number}` with both `/users` and `/users/**:id`. For this reason, we replace all route
 * parameters with `**:id` to make sure that the correct route is matched.
 *
 * @param route The route to be parameterized
 * @returns A parameterized version of the route
 */
export function asTypeParameterizedRoute<const Route extends string>(route: Route): Parametrify<Route> {
	return route as Parametrify<Route>;
}

type Parametrify<Route extends string> = Route extends `${infer Prefix}/${infer Rest}`
	? `${Parametrify<Prefix>}/${Parametrify<Rest>}`
	: Route extends `${number}`
		? `**:id`
		: Route;
