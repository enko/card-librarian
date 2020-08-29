ALTER TABLE card_management.foreign_card_data ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE deck_management.decks ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE deck_management.cards_to_decks ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
