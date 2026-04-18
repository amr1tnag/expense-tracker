from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

transactions = []

@app.route('/transactions', methods=['GET'])
def get_transactions():
    return jsonify(transactions)

@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    transactions.append(data)
    return jsonify({"message": "Added"})

@app.route('/transactions/<int:index>', methods=['DELETE'])
def delete_transaction(index):
    if index < len(transactions):
        transactions.pop(index)
    return jsonify({"message": "Deleted"})

if __name__ == '__main__':
    app.run(debug=True)
