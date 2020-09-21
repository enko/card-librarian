ALTER TABLE card_management.sets DROP COLUMN import_data;
ALTER TABLE card_management.cards DROP COLUMN import_data;
ALTER TABLE card_management.foreign_card_data DROP COLUMN import_data;

ALTER TABLE card_management.cards ADD CONSTRAINT uq___cards___uuid UNIQUE (uuid);
ALTER TABLE card_management.sets ADD CONSTRAINT uq___sets___code UNIQUE (code);
ALTER TABLE card_management.foreign_card_data ADD CONSTRAINT uq___foreign_card_data___card_id__language UNIQUE (card_id,language);
