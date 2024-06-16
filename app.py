from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        data = request.get_json()
        tasks.append({'id': len(tasks) + 1, 'task': data['task']})
        return jsonify(tasks[-1])
    return jsonify(tasks)

@app.route('/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def update_delete_task(task_id):
    global tasks
    task = next((task for task in tasks if task['id'] == task_id), None)
    if request.method == 'PUT':
        data = request.get_json()
        task['task'] = data['task']
        return jsonify(task)
    elif request.method == 'DELETE':
        tasks = [task for task in tasks if task['id'] != task_id]
        return '', 204

if __name__ == '__main__':
    app.run(debug=True)
