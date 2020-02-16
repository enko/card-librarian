CREATE SCHEMA deck_management;

CREATE TABLE deck_management.decks (
	id serial NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
	"updatedAt" timestamp with time zone,
	created_by integer,
	updated_by integer,
	name text,
	is_public boolean DEFAULT false,
	CONSTRAINT pk___decks___id PRIMARY KEY (id)

);

CREATE TABLE deck_management.cards_to_decks (
	id serial NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
	"updatedAt" timestamp with time zone,
	created_by integer,
	updated_by integer,
	deck_id integer NOT NULL,
	card_id integer NOT NULL,
	amount integer NOT NULL,
	CONSTRAINT pk___cards_to_decks___id PRIMARY KEY (id)

);

ALTER TABLE deck_management.cards_to_decks ADD CONSTRAINT fk___cards_to_decks___card_id___cards FOREIGN KEY (card_id)
REFERENCES card_management.cards (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE deck_management.cards_to_decks ADD CONSTRAINT fk___cards_to_decks___deck_id___decks FOREIGN KEY (deck_id)
REFERENCES deck_management.decks (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
