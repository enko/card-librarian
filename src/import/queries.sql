INSERT INTO card_management.sets (
       created_at,
       code,
       name
)
SELECT
       NOW(),
       s.code,
       s.name
FROM sets AS s
ON CONFLICT (code) DO UPDATE SET
   updated_at = NOW(),
   name = excluded.name;


INSERT INTO card_management.cards (
       created_at,
       name,
       colors,
       mana_cost,
       set_id,
       types,
       uuid,
       set_number,
       converted_mana_cost
)
SELECT
       NOW(),
       c.name,
       c.colors,
       c.manacost,
       (select s.id from card_management.sets AS s where s.code = c.setcode),
       c.types,
       c.uuid::uuid,
       c.number,
       c.manavalue
FROM cards AS c
ON CONFLICT (uuid) DO UPDATE SET
   updated_at = NOW(),
   name = excluded.name,
   colors = excluded.colors,
   mana_cost = excluded.mana_cost,
   set_id = excluded.set_id,
   types = excluded.types,
   set_number = excluded.set_number,
   converted_mana_cost = excluded.converted_mana_cost;

INSERT INTO card_management.foreign_card_data (
       created_at,
       flavor_text,
       language,
       name,
       text,
       type,
       card_id
)
SELECT
       NOW(),
       fd.flavortext,
       fd.language,
       fd.name,
       fd.text,
       fd.type,
       (SELECT c.id FROM card_management.cards AS c WHERE c.uuid = fd.uuid::uuid)
FROM cardforeigndata AS fd
ON CONFLICT (card_id, language) DO UPDATE SET
   updated_at = NOW(),
   flavor_text = excluded.flavor_text,
   name = excluded.name,
   text = excluded.text,
   type = excluded.type;

-- TODO need to refactor

-- DELETE FROM card_management.legalities;
-- DELETE FROM card_management.legality_formats;

-- INSERT INTO card_management.legality_formats (
--        code,
--        name,
--        created_at
-- )
-- SELECT
--     DISTINCT format,
--     format,
--     NOW()
-- FROM
--     cardlegalities
-- ON CONFLICT DO NOTHING;

-- INSERT INTO card_management.legalities (
--        created_at,
--        status,
--        card_id,
--        legality_format_id
-- )
-- SELECT
--     NOW(),
--     l.status::card_management.enum___legalities___status,
--     (SELECT c.id FROM card_management.cards AS c WHERE c.uuid = l.uuid::uuid),
--     (SELECT lf.id FROM card_management.legality_formats AS lf WHERE lf.code = l.format)
-- FROM
--     legalities AS l
