ALTER TABLE newsletter
	ADD CONSTRAINT newsletter_unique_mail_to
		UNIQUE (mail_to);
