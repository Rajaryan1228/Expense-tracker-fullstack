const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });

    // Fetch total expense
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Get income transactions of last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    // Get total income of last 60 days
    const totalIncomeLast60Days = last60DaysIncomeTransactions.reduce((acc, income) => acc + income.amount, 0);

    // Get expense transactions of last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    // Get total expense of last 30 days
    const totalExpenseLast30Days = last30DaysExpenseTransactions.reduce((acc, expense) => acc + expense.amount, 0);

    // Fetch last 5 transactions (income and expense)
    const lastIncomeTxns = await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5);
    const lastExpenseTxns = await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5);

    const transactions = [
      ...lastIncomeTxns.map(txn => ({ ...txn.toObject(), type: 'income' })),
      ...lastExpenseTxns.map(txn => ({ ...txn.toObject(), type: 'expense' })),
    ].sort((a, b) => b.date - a.date).slice(0, 5); // Take latest 5 combined

    // Final response
    res.json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: totalExpenseLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: totalIncomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: transactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
