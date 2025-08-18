import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import axiosInstance from '../../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Fetch expense details
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSES}`);
      if (response?.data) {
        setExpenseData(response.data);
      }
    } catch (err) {
      console.log("Something went wrong, Please try again", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation checks
    if (!category || !category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      setShowSuccess(true); // Trigger success toast effect
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error?.response?.data?.message || error.message
      );
      toast.error(
        error?.response?.data?.message || "Failed to add expense. Please try again."
      );
    }
  };

  // Handle deleting expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      setShowDeleteSuccess(true); // Trigger delete success toast effect
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense",
        error?.response?.data?.message || error.message
      );
      toast.error(
        error?.response?.data?.message || "Failed to delete expense. Please try again."
      );
    }
  };

  // Handle download expense details (dummy placeholder)
  const handleDownloadExpenseDetails = async () => {
   try {
     const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
      responseType: "blob",
    });

    // Create a URL for the blob and trigger a download
     const url = window.URL.createObjectURL(new Blob([response.data]));
     const link = document.createElement('a');
     link.href = url;
     link.setAttribute('download', "expense_detail.xlsx");
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     window.URL.revokeObjectURL(url);
   } catch (error) {
     console.error("Download failed", error);
     toast.error("Failed to download expense details.");
   }
 };

  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, []);

  // Show "add expense" toast once per successful add
  useEffect(() => {
    if (showSuccess) {
      toast.success("Expense added successfully", { autoClose: 3000 });
      setShowSuccess(false); // Reset the flag
    }
  }, [showSuccess]);

  // Show "delete expense" toast once per successful delete
  useEffect(() => {
    if (showDeleteSuccess) {
      toast.success("Expense details deleted successfully", { autoClose: 3000 });
      setShowDeleteSuccess(false); // Reset the flag
    }
  }, [showDeleteSuccess]);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense details?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>

      <ToastContainer
        toastClassName=""
        style={{ fontSize: '13px' }}
      />
    </DashboardLayout>
  );
};

export default Expense;
