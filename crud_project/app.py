from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

# DB create
def init_db():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS employees(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            role TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Home page
@app.route('/')
def home():
    return render_template('index.html')

# GET
@app.route('/employees', methods=['GET'])
def get_employees():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute("SELECT * FROM employees")
    rows = cur.fetchall()
    conn.close()

    data = []
    for r in rows:
        data.append({"id": r[0], "name": r[1], "role": r[2]})

    return jsonify(data)

# POST
@app.route('/employees', methods=['POST'])
def add_employee():
    data = request.get_json()

    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute("INSERT INTO employees (name, role) VALUES (?, ?)",
                (data['name'], data['role']))
    conn.commit()
    conn.close()

    return jsonify({"message": "Added"})

# PUT
@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    data = request.get_json()

    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute("UPDATE employees SET name=?, role=? WHERE id=?",
                (data['name'], data['role'], id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Updated"})

# DELETE
@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute("DELETE FROM employees WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted"})

if __name__ == '__main__':
    app.run(debug=True)