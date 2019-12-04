to test the application, simply type in the console this pattern: node mongo.js <Password> "<name of the person>" <number>
  
  Example: node mongo.js 1a2b3c4d "ada lovelace" 040-12345678
  returns -> added ada lovelace 040-12345678 to the phonebook
  
If the name and number are omitted, the console will return all the people in the database using this pattern: node mongo.js <Password>
