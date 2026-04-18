import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const BASE_URL = "https://expense-tracker-backend.onrender.com";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  // 🔹 Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/transactions`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🔹 Add transaction
  const addTransaction = async () => {
    if (!text || !amount) return;

    try {
      const res = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      console.log("Added:", data);

      setText("");
      setAmount("");
      fetchTransactions();
    } catch (err) {
      console.error("POST error:", err);
    }
  };

  // 🔹 Delete transaction
  const deleteTransaction = async (index) => {
    try {
      await fetch(`${BASE_URL}/transactions/${index}`, {
        method: "DELETE",
      });

      fetchTransactions();
    } catch (err) {
      console.error("DELETE error:", err);
    }
  };

  // 🔹 Calculations
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expense;

  // 🔹 Chart
  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, Math.abs(expense)],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#cbd5f5",
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>

        {/* LEFT PANEL */}
        <div style={styles.left}>
          <h1 style={styles.title}>💎 Expense Tracker</h1>

          <div style={styles.balanceCard}>
            <p>Total Balance</p>
            <h1>₹{balance}</h1>
          </div>

          <div style={styles.row}>
            <div style={styles.incomeCard}>
              <p>Income</p>
              <h3>₹{income}</h3>
            </div>

            <div style={styles.expenseCard}>
              <p>Expense</p>
              <h3>₹{Math.abs(expense)}</h3>
            </div>
          </div>

          {/* Form */}
          <div style={styles.form}>
            <input
              style={styles.input}
              placeholder="Description"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Amount (+income, -expense)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button style={styles.button} onClick={addTransaction}>
              Add Transaction
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.right}>

          {/* Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartWrapper}>
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Transactions */}
          <div style={styles.list}>
            {transactions.length === 0 && (
              <p style={styles.empty}>No transactions yet 💸</p>
            )}

            {transactions.map((t, i) => (
              <div
                key={i}
                style={{
                  ...styles.item,
                  borderLeft:
                    t.amount > 0
                      ? "4px solid #22c55e"
                      : "4px solid #ef4444",
                }}
              >
                <div>
                  <p style={styles.text}>{t.text}</p>
                  <span
                    style={{
                      ...styles.amount,
                      color: t.amount > 0 ? "#22c55e" : "#ef4444",
                    }}
                  >
                    ₹{t.amount}
                  </span>
                </div>

                <button
                  style={styles.delete}
                  onClick={() => deleteTransaction(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    background: "#0f172a",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  dashboard: {
    display: "flex",
    gap: "20px",
  },
  left: {
    flex: 1,
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
    color: "#fff",
  },
  right: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: { marginBottom: "15px" },
  balanceCard: {
    background: "linear-gradient(135deg, #38bdf8, #6366f1)",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },
  row: { display: "flex", gap: "10px", marginTop: "10px" },
  incomeCard: {
    flex: 1,
    background: "#22c55e",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
  },
  expenseCard: {
    flex: 1,
    background: "#ef4444",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
  },
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#334155",
    color: "#fff",
  },
  button: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
  },
  chartCard: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "center",
  },
  chartWrapper: {
    width: "260px",
    height: "260px",
  },
  list: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "15px",
    maxHeight: "260px",
    overflowY: "auto",
  },
  item: {
    background: "#334155",
    padding: "12px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  text: { margin: 0, color: "#e2e8f0" },
  amount: { fontSize: "14px", fontWeight: "600" },
  delete: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    opacity: 0.6,
  },
};
