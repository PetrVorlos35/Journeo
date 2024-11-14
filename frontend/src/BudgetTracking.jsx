import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const BudgetTracking = () => {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const addExpense = () => {
    if (expenseName && expenseAmount) {
      setExpenses([...expenses, { name: expenseName, amount: parseFloat(expenseAmount) }]);
      setExpenseName('');
      setExpenseAmount('');
    }
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const remainingBudget = budget - totalExpenses;

  const data = {
    labels: expenses.map((expense) => expense.name),
    datasets: [
      {
        label: 'Expenses',
        data: expenses.map((expense) => expense.amount),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Budget Tracking</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Set your Budget:</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
          className="w-full p-2 border rounded-lg"
          placeholder="Enter your budget"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Add an Expense:</label>
        <input
          type="text"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
          placeholder="Expense name"
        />
        <input
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
          placeholder="Expense amount"
        />
        <button
          onClick={addExpense}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Add Expense
        </button>
      </div>
      <div className="mb-4">
        <p className="text-lg font-bold text-gray-700">Total Expenses: ${totalExpenses.toFixed(2)}</p>
        <p className={`text-lg font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
          Remaining Budget: ${remainingBudget.toFixed(2)}
        </p>
      </div>
      <div className="w-full mt-6">
        <Line data={data} />
      </div>
    </div>
  );
};

export default BudgetTracking;
