ALTER TABLE card_management.cards ADD COLUMN converted_mana_cost float NOT NULL DEFAULT 0;

UPDATE card_management.cards
SET converted_mana_cost=subquery.converted_mana_cost
FROM (select
      i__c.id as id,
      (i__c.import_data->>'convertedManaCost')::float as converted_mana_cost
    from card_management.cards as i__c) AS subquery
WHERE card_management.cards.id = subquery.id;
