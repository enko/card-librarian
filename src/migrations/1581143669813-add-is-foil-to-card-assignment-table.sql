SET search_path=public,pg_catalog,card_management;

ALTER TABLE card_management.card_to_libraries ADD COLUMN is_foil bool NOT NULL DEFAULT false;
ALTER TABLE card_management.foreign_card_data ALTER COLUMN "createdAt" SET DEFAULT NOW();

ALTER TABLE card_management.card_to_libraries DROP CONSTRAINT uq___card_to_libaries___card_id___library_id;
ALTER TABLE card_management.card_to_libraries ADD CONSTRAINT uq___card_to_libaries___card_id___library_id___is_foil UNIQUE (card_id, library_id, is_foil);
