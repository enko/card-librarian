-- Diff code generated with pgModeler (PostgreSQL Database Modeler)
-- pgModeler version: 0.9.2
-- Diff date: 2020-02-18 10:14:32
-- Source model: mtg_app
-- Database: mtg_app
-- PostgreSQL version: 12.0

-- [ Diff summary ]
-- Dropped objects: 0
-- Created objects: 5
-- Changed objects: 0
-- Truncated tables: 0

SET search_path=public,pg_catalog,card_management,library_management,deck_management;
-- ddl-end --


-- [ Created objects ] --
-- object: card_management.enum___legalities___status | type: TYPE --
-- DROP TYPE IF EXISTS card_management.enum___legalities___status CASCADE;
CREATE TYPE card_management.enum___legalities___status AS
 ENUM ('Legal','Banned','Restricted');
-- ddl-end --
-- ALTER TYPE card_management.enum___legalities___status OWNER TO postgres;
-- ddl-end --

-- object: card_management.legalities | type: TABLE --
-- DROP TABLE IF EXISTS card_management.legalities CASCADE;
CREATE TABLE card_management.legalities (
	id serial NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp with time zone,
	created_by integer,
	updated_by integer,
	status card_management.enum___legalities___status,
	card_id integer NOT NULL,
	legality_format_id integer NOT NULL,
	CONSTRAINT pk___legalities___id PRIMARY KEY (id)

);
-- ddl-end --
-- ALTER TABLE card_management.legalities OWNER TO postgres;
-- ddl-end --

-- object: card_management.legality_formats | type: TABLE --
-- DROP TABLE IF EXISTS card_management.legality_formats CASCADE;
CREATE TABLE card_management.legality_formats (
	id serial NOT NULL,
	"createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp with time zone,
	created_by integer,
	updated_by integer,
	code text NOT NULL,
	name text NOT NULL,
	CONSTRAINT pk___legality_formats___id PRIMARY KEY (id)

);
-- ddl-end --
-- ALTER TABLE card_management.legality_formats OWNER TO postgres;
-- ddl-end --



-- [ Created foreign keys ] --
-- object: fk___legalities___card_id___cards | type: CONSTRAINT --
-- ALTER TABLE card_management.legalities DROP CONSTRAINT IF EXISTS fk___legalities___card_id___cards CASCADE;
ALTER TABLE card_management.legalities ADD CONSTRAINT fk___legalities___card_id___cards FOREIGN KEY (card_id)
REFERENCES card_management.cards (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk___legalities___legality_format_id___legalities_formats | type: CONSTRAINT --
-- ALTER TABLE card_management.legalities DROP CONSTRAINT IF EXISTS fk___legalities___legality_format_id___legalities_formats CASCADE;
ALTER TABLE card_management.legalities ADD CONSTRAINT fk___legalities___legality_format_id___legalities_formats FOREIGN KEY (legality_format_id)
REFERENCES card_management.legality_formats (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --
