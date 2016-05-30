# Board App

This is a personal project that utilizes React.js to create a sticky notes board. The purpose of this app is to create an environment where programmers can leave sticky notes to their team members. All notes are synchronized with a json file, making it so that any changes a user makes would be saved and syncronized with everyone else's boards. 

## To use

I implemented a simple serve with Python Flask to serve static files from `public/` and handle requests to `/api/comments` to fetch or add data. 
Start your own server by doing the following:

### Python

```sh
pip install -r requirements.txt
python server.py
```


And visit <http://localhost:4000/>. Try opening multiple tabs.

To create a sticky note, simply click anywhere on the screen.
To delete a sticky note, first hover your mouse to a note you want to delete. An X button will appear. 

## Changing the port

You can change the port number by setting the `$PORT` environment variable.

