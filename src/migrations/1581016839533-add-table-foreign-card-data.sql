-- Diff code generated with pgModeler (PostgreSQL Database Modeler)
-- pgModeler version: 0.9.2
-- Diff date: 2020-02-06 21:12:41
-- Source model: mtg_app
-- Database: mtg_app
-- PostgreSQL version: 11.0

-- [ Diff summary ]
-- Dropped objects: 0
-- Created objects: 2
-- Changed objects: 0
-- Truncated tables: 0

SET search_path=public,pg_catalog,card_management;
-- ddl-end --


-- [ Created objects ] --
-- object: card_management.foreign_card_data | type: TABLE --
-- DROP TABLE IF EXISTS card_management.foreign_card_data CASCADE;
CREATE TABLE card_management.foreign_card_data (
	id serial NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
	"updatedAt" timestamp with time zone,
	created_by integer,
	updated_by integer,
	flavor_text text NOT NULL,
	language text NOT NULL,
	name text NOT NULL,
	text text NOT NULL,
	type text NOT NULL,
	import_data jsonb NOT NULL,
	card_id integer NOT NULL,
	CONSTRAINT pk___foreign_card_data___id PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON TABLE card_management.foreign_card_data IS E'Contains translation of card data';
-- ddl-end --
-- ALTER TABLE card_management.foreign_card_data OWNER TO postgres;
-- ddl-end --



-- [ Created foreign keys ] --
-- object: fk___foreign_card_data___card_id___cards | type: CONSTRAINT --
-- ALTER TABLE card_management.foreign_card_data DROP CONSTRAINT IF EXISTS fk___foreign_card_data___card_id___cards CASCADE;
ALTER TABLE card_management.foreign_card_data ADD CONSTRAINT fk___foreign_card_data___card_id___cards FOREIGN KEY (card_id)
REFERENCES card_management.cards (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

