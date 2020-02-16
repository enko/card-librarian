ALTER TABLE card_management.foreign_card_data ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE deck_management.decks ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE deck_management.cards_to_decks ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
