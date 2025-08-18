const Income = require('../models/Income');
const xlsx = require('xlsx');

// Add Income Source
exports.addIncome = async (req, res) => {
  try {
    const userId = req.user._id;
    const { icon, source, amount, date } = req.body;  // Include 'date' from req.body

    // Validation: check for missing required fields
    if (!source || !amount) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // If no date provided, use current date
    const incomeDate = date ? new Date(date) : new Date();

    // Create new income document
    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: incomeDate,
    });

    await newIncome.save();

    res.status(201).json(newIncome);
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Placeholder for other functions
exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteIncome = async (req, res) => {
    const incomeId = req.params.id;
    try {
        const income = await Income.findByIdAndDelete(incomeId);
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        // Logic to generate Excel file from incomes data
        // This is a placeholder; actual implementation will depend on the library used for Excel generation

        const data = incomes.map(income => ({
            source: income.source,
            amount: income.amount,
            date: income.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Incomes');
        xlsx.writeFile(wb, 'incomes.xlsx');
        res.download('incomes.xlsx');
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
