# This file provided by Facebook is for non-commercial testing and evaluation
# purposes only. Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import json
import os
import time
from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))


@app.route('/api/notes', methods=['GET', 'POST'])
def notes_handler():
    with open('notes.json', 'r') as f:
        notes = json.loads(f.read())
    if request.method == 'POST':
        print request.form.to_dict()
        new_note = request.form.to_dict()
        new_note["id"] = int(new_note["id"])
        notes.append(new_note)

        with open('notes.json', 'w') as f:
            f.write(json.dumps(notes, indent=4, separators=(',', ': ')))

    return Response(
        json.dumps(notes),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/api/modifynote', methods=['POST'])
def modify_handler():
    with open('notes.json', 'r') as f:
        notes = json.loads(f.read())

    note_to_modify = request.form.to_dict()
    for note in notes:
        print note
        if note["id"] == int(note_to_modify["id"]):
            note["text"] = note_to_modify["text"]
            break


    with open('notes.json', 'w') as f:
        f.write(json.dumps(notes, indent=4, separators=(',', ': ')))

    return Response(
        json.dumps(notes),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

@app.route('/api/removenote', methods=['POST'])
def remove_handler():
    with open('notes.json', 'r') as f:
        notes = json.loads(f.read())

    note_id = int(request.form.to_dict()["id"])
    for note in notes:
        if note["id"] == note_id:
            notes.remove(note)
            break

    with open('notes.json', 'w') as f:
        f.write(json.dumps(notes, indent=4, separators=(',', ': ')))

    return Response(
        json.dumps(notes),
        mimetype='application/json',
        headers={
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )


if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get("PORT", 4000)))
