const Expense = require('../models/Expense');
const xlsx = require('xlsx');

// Add Expense Source
exports.addExpense = async (req, res) => {
  try {
    const userId = req.user._id;
    const { icon, category, amount, date } = req.body;

    // Validation: check for missing required fields
    if (!category || !amount) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // If no date provided, use current date
    const expenseDate = date ? new Date(date) : new Date();

    // Create new expense document
    const newExpense = new Expense({
      userId,
      icon,
      category,       // use category here
      amount,
      date: expenseDate,
    });

    await newExpense.save();

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all expenses
exports.getAllExpense = async (req, res) => {
  const userId = req.user._id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete expense source
exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {  // fixed variable name from 'income' to 'expense'
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Download expense as Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenses.map(expense => ({
      category: expense.category,
      amount: expense.amount,
      date: expense.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Expenses');

    const filePath = 'expenses.xlsx';
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    console.error("Error downloading expense Excel:", error);
    res.status(500).json({ message: "Server error" });
  }
};
