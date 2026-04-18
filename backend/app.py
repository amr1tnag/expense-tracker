from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# 🔥 Allow your GitHub Pages origin (and handle preflight)
CORS(
    app,
    resources={r"/*": {"origins": "https://amr1tnag.github.io"}},
    methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

transactions = []

@app.route("/")
def home():
    return "Backend is running 🚀"

# Combine GET + POST in one route
@app.route("/transactions", methods=["GET", "POST", "OPTIONS"])
def transactions_route():
    if request.method == "OPTIONS":
        return ("", 204)  # preflight OK

    if request.method == "GET":
        return jsonify(transactions)

    if request.method == "POST":
        data = request.get_json(force=True)
        transactions.append(data)
        return jsonify({"message": "Added"})

# DELETE (also allow OPTIONS)
@app.route("/transactions/<int:index>", methods=["DELETE", "OPTIONS"])
def delete_transaction(index):
    if request.method == "OPTIONS":
        return ("", 204)

    if 0 <= index < len(transactions):
        transactions.pop(index)
    return jsonify({"message": "Deleted"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
