interface tMail {
	id: number;
	mail_to: string;
	type: string;
	mail_name: string;
	mail_from: string;
	subject: string;
	html: string;
	_to: string;
	usuario: string;
	createdAt: Date;
	updatedAt: Date;
}

export default tMail;
