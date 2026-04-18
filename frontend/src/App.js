import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  const fetchTransactions = async () => {
    const res = await fetch("http://127.0.0.1:5000/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    if (!text || !amount) return;

    await fetch("http://127.0.0.1:5000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, amount: Number(amount) }),
    });

    setText("");
    setAmount("");
    fetchTransactions();
  };

  const deleteTransaction = async (index) => {
    await fetch(`http://127.0.0.1:5000/transactions/${index}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expense;

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
          padding: 20,
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
            <p style={{ opacity: 0.8 }}>Total Balance</p>
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
    alignItems: "flex-start",
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

  title: {
    marginBottom: "15px",
  },

  balanceCard: {
    background: "linear-gradient(135deg, #38bdf8, #6366f1)",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "15px",
  },

  row: {
    display: "flex",
    gap: "10px",
  },

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
    alignItems: "center",
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
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  item: {
    background: "#334155",
    padding: "12px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    margin: 0,
    fontWeight: "500",
    color: "#e2e8f0",
  },

  amount: {
    fontSize: "14px",
    fontWeight: "600",
  },

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
