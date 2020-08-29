-- Diff code generated with pgModeler (PostgreSQL Database Modeler)
-- pgModeler version: 0.9.2
-- Diff date: 2020-02-18 13:44:24
-- Source model: mtg_app
-- Database: mtg_app
-- PostgreSQL version: 12.0

-- [ Diff summary ]
-- Dropped objects: 0
-- Created objects: 2
-- Changed objects: 0
-- Truncated tables: 0

SET search_path=public,pg_catalog,card_management,library_management,deck_management;
-- ddl-end --


-- [ Created objects ] --
-- object: deck_management.enum___cards_to_decks___type | type: TYPE --
-- DROP TYPE IF EXISTS deck_management.enum___cards_to_decks___type CASCADE;
CREATE TYPE deck_management.enum___cards_to_decks___type AS
 ENUM ('main','sideboard');
-- ddl-end --
-- ALTER TYPE deck_management.enum___cards_to_decks___type OWNER TO postgres;
-- ddl-end --

-- object: type | type: COLUMN --
-- ALTER TABLE deck_management.cards_to_decks DROP COLUMN IF EXISTS type CASCADE;
ALTER TABLE deck_management.cards_to_decks ADD COLUMN type deck_management.enum___cards_to_decks___type NULL;
-- ddl-end --

UPDATE deck_management.cards_to_decks SET type = 'main';

ALTER TABLE deck_management.cards_to_decks ALTER COLUMN type SET NOT NULL;

