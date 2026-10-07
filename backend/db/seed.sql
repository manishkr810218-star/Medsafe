-- ======================================================================
-- DEMO SEED DATA ONLY. Every drug, food and interaction here is FICTIONAL
-- and exists only to test the prototype. NOT medical information.
-- Safe to re-run: rows are upserted.
-- ======================================================================

INSERT INTO patients (id, display_name) VALUES (1, 'Demo Patient')
  ON DUPLICATE KEY UPDATE display_name = VALUES(display_name);

INSERT INTO drugs (id, name, is_demo) VALUES
  ('demoxetine',  'Demoxetine',  1),
  ('placebol',    'Placebol',    1),
  ('sampleprin',  'Sampleprin',  1),
  ('mockacillin', 'Mockacillin', 1),
  ('testafen',    'Testafen',    1)
  ON DUPLICATE KEY UPDATE name = VALUES(name), is_demo = VALUES(is_demo);

INSERT INTO foods (id, name_en, name_hi, is_demo) VALUES
  ('demo-citrus', 'Demo Citrus Fruit',  'डेमो खट्टा फल', 1),
  ('demo-dairy',  'Demo Dairy Product', 'डेमो डेयरी उत्पाद', 1),
  ('demo-greens', 'Demo Leafy Greens',  'डेमो हरी पत्तेदार सब्ज़ी', 1),
  ('demo-tea',    'Demo Herbal Tea',    'डेमो हर्बल चाय', 1)
  ON DUPLICATE KEY UPDATE name_en = VALUES(name_en), name_hi = VALUES(name_hi), is_demo = VALUES(is_demo);

INSERT INTO drug_interactions
  (drug_a_id, drug_b_id, severity, message_en, message_hi, advice_en, advice_hi, is_demo) VALUES
  ('demoxetine', 'placebol', 'high',
   'Demo alert: Demoxetine and Placebol are set up as a high-severity example pair.',
   'डेमो अलर्ट: Demoxetine और Placebol को उच्च गंभीरता के उदाहरण के रूप में रखा गया है।',
   'Sample text only. A real app would show verified guidance here.',
   'यह केवल नमूना पाठ है। वास्तविक ऐप में यहाँ सत्यापित जानकारी दिखाई जाएगी।', 1),
  ('sampleprin', 'testafen', 'moderate',
   'Demo alert: Sampleprin and Testafen are set up as a moderate-severity example pair.',
   'डेमो अलर्ट: Sampleprin और Testafen को मध्यम गंभीरता के उदाहरण के रूप में रखा गया है।',
   'Sample text only. A real app would show verified guidance here.',
   'यह केवल नमूना पाठ है। वास्तविक ऐप में यहाँ सत्यापित जानकारी दिखाई जाएगी।', 1),
  ('mockacillin', 'placebol', 'low',
   'Demo alert: Mockacillin and Placebol are set up as a low-severity example pair.',
   'डेमो अलर्ट: Mockacillin और Placebol को हल्की गंभीरता के उदाहरण के रूप में रखा गया है।',
   'Sample text only. A real app would show verified guidance here.',
   'यह केवल नमूना पाठ है। वास्तविक ऐप में यहाँ सत्यापित जानकारी दिखाई जाएगी।', 1)
  ON DUPLICATE KEY UPDATE
    severity = VALUES(severity), message_en = VALUES(message_en), message_hi = VALUES(message_hi),
    advice_en = VALUES(advice_en), advice_hi = VALUES(advice_hi), is_demo = VALUES(is_demo);

INSERT INTO drug_food_interactions
  (drug_id, food_id, severity, message_en, message_hi, advice_en, advice_hi, is_demo) VALUES
  ('demoxetine', 'demo-citrus', 'moderate',
   'Demo alert: Demoxetine with Demo Citrus Fruit is a moderate-severity example.',
   'डेमो अलर्ट: Demoxetine के साथ डेमो खट्टा फल मध्यम गंभीरता का उदाहरण है।',
   'Sample text only. Not real dietary guidance.',
   'केवल नमूना पाठ। यह वास्तविक आहार सलाह नहीं है।', 1),
  ('mockacillin', 'demo-dairy', 'low',
   'Demo alert: Mockacillin with Demo Dairy Product is a low-severity example.',
   'डेमो अलर्ट: Mockacillin के साथ डेमो डेयरी उत्पाद हल्की गंभीरता का उदाहरण है।',
   'Sample text only. Not real dietary guidance.',
   'केवल नमूना पाठ। यह वास्तविक आहार सलाह नहीं है।', 1),
  ('testafen', 'demo-greens', 'high',
   'Demo alert: Testafen with Demo Leafy Greens is a high-severity example.',
   'डेमो अलर्ट: Testafen के साथ डेमो हरी पत्तेदार सब्ज़ी उच्च गंभीरता का उदाहरण है।',
   'Sample text only. Not real dietary guidance.',
   'केवल नमूना पाठ। यह वास्तविक आहार सलाह नहीं है।', 1)
  ON DUPLICATE KEY UPDATE
    severity = VALUES(severity), message_en = VALUES(message_en), message_hi = VALUES(message_hi),
    advice_en = VALUES(advice_en), advice_hi = VALUES(advice_hi), is_demo = VALUES(is_demo);
