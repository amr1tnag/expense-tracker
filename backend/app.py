from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# ✅ Proper CORS (handles preflight automatically)
CORS(app)

# In-memory storage
transactions = []

# Home route (for testing)
@app.route('/')
def home():
    return "Backend is running 🚀"

# GET + POST
@app.route('/transactions', methods=['GET', 'POST'])
def handle_transactions():
    if request.method == 'GET':
        return jsonify(transactions)

    if request.method == 'POST':
        data = request.get_json()
        transactions.append(data)
        return jsonify({"message": "Added"})

# DELETE
@app.route('/transactions/<int:index>', methods=['DELETE'])
def delete_transaction(index):
    if index < len(transactions):
        transactions.pop(index)
    return jsonify({"message": "Deleted"})

# Run app (Render compatible)
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
