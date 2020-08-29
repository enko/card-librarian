ALTER TABLE card_management.cards
ADD
  COLUMN set_number text;

COMMENT ON COLUMN card_management.cards.set_number IS E'A unique number inside a set that is printed on every card.';

UPDATE card_management.cards
SET set_number=subquery.number
FROM (select
      i__c.id as id,
      i__c.import_data->>'number' as number
    from card_management.cards as i__c) AS subquery
WHERE card_management.cards.id = subquery.id;

ALTER TABLE card_management.cards ALTER COLUMN set_number SET NOT NULL;
