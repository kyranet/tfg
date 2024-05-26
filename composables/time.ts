const DateTimeFormat = new Intl.DateTimeFormat('es-ES', { timeStyle: 'short', dateStyle: 'medium' });
export function useDateTimeFormat(date: string | number | Date) {
	return DateTimeFormat.format(new Date(date));
}
