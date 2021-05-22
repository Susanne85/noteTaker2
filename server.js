
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Define a port to listen for incoming requests
const app = express();

let port=process.env.PORT;
if (port ==null || port == ""){
    port=3000;
}

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const directoryPath = __dirname + '/public/';
let notesArray = [];

app.get('/', (request, result) => result.sendFile(path.join(directoryPath, 'index.html')));

app.get('/notes', (request, result) => result.sendFile(path.join(directoryPath, 'notes.html')));

// Get text from the user and save to notes array, use a Post to add the new note and return the new notes to the user.
app.get('/api/notes', (request, result) => {
  fs.readFile('./db/db.json', 'utf8', function (err, data) {
    if (err) throw err;
    //do operation on data that generates say notesArray;
    notesArray = JSON.parse(data);
    for (let i = 0; i < notesArray.length; i++) {
      Object.assign(notesArray[i], { "id": uuidv4() });
    }
     
    return result.json(notesArray);
  });
});

app.delete('/api/notes/:deleteid', (request, result) => {
  const deleteLine = request.params.deleteid;
   
  let i = notesArray.findIndex(data => data.id === deleteLine);
  if (i !== -1) {
    notesArray.splice(i, 1);
  }
  
  notesArray.forEach(note=> delete note.id);

  let notesJSON = JSON.stringify(notesArray);

  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), notesJSON, 'utf-8');

  return result.json(notesArray);
});

app.post('/api/notes', (request, result) => {
  const newNotes = request.body;

  notesArray.push(newNotes);

  notesArray.forEach(note=> delete note.id);

  let notesJSON = JSON.stringify(notesArray);

  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), notesJSON, 'utf-8');

  result.json(notesArray);

  // uuid
  // dwadwa-dwadwa-dwa-dwa-dwa

});

// Start our server so that it can begin listening to client requests.
app.listen(port, () => console.log(`App listening on PORT ${port}`));