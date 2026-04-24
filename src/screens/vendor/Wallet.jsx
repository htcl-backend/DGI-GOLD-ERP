import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../Contexts/AuthContext';
import { FaWallet, FaPlus, FaMinus, FaHistory, FaLock, FaUnlock, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiService from '../service/apiService';

const VendorWallet = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [walletData, setWalletData] = useState({
        balance: 0,
        currency: 'INR',
        locked: 0,
        available: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
    });

    const [transactions, setTransactions] = useState([]);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [bankAccountId, setBankAccountId] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

    // 🔄 Fetch wallet balance on component mount
    useEffect(() => {
        fetchWalletData();
    }, [user]);

    const fetchWalletData = async () => {
        try {
            setFetchingData(true);
            console.log('🔄 Fetching wallet balance...');

            // ✅ GET /wallet/balance
            const balanceResult = await apiService.wallet.getBalance();
            console.log('📦 Balance Response:', balanceResult);

            if (balanceResult.success) {
                const balanceData = balanceResult.data?.data || balanceResult.data;
                setWalletData(prev => ({
                    ...prev,
                    balance: balanceData.balance || 0,
                    available: balanceData.available || 0,
                    locked: balanceData.locked || 0,
                    currency: balanceData.currency || 'INR',
                    totalEarned: balanceData.totalEarned || 0,
                    totalWithdrawn: balanceData.totalWithdrawn || 0,
                }));
            }

            // ✅ GET /wallet/transactions
            console.log('🔄 Fetching transactions...');
            const txnResult = await apiService.wallet.getTransactions({
                limit: 20,
                status: 'COMPLETED'
            });
            console.log('📦 Transactions Response:', txnResult);

            if (txnResult.success) {
                const txnData = Array.isArray(txnResult.data) ? txnResult.data : (txnResult.data?.data || []);
                const formattedTransactions = (Array.isArray(txnData) ? txnData : []).map(txn => ({
                    id: txn.id || txn.transactionId,
                    date: txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                    type: txn.type?.toLowerCase() === 'deposit' ? 'credit' : 'debit',
                    amount: txn.amount || 0,
                    description: txn.description || `${txn.type} transaction`,
                    status: txn.status?.toLowerCase() || 'pending',
                    reference: txn.reference || txn.id
                }));
                setTransactions(formattedTransactions);
                console.log('✅ Transactions loaded:', formattedTransactions.length);
            }
        } catch (error) {
            console.error('🔴 Error fetching wallet data:', error);
            toast.error('Failed to load wallet data');
        } finally {
            setFetchingData(false);
        }
    };

    const handleDeposit = async () => {
        if (!depositAmount || depositAmount <= 0) {
            toast.error('Please enter valid amount');
            return;
        }

        try {
            setLoading(true);
            console.log('💳 Initiating deposit:', depositAmount);

            // ✅ POST /wallet/deposit/initiate
            const result = await apiService.wallet.initiateDeposit({
                amount: parseFloat(depositAmount),
                currency: 'INR',
                paymentMethod: paymentMethod,
                idempotencyKey: `deposit-${Date.now()}`
            });

            console.log('📍 Deposit Response:', result);

            if (result.success) {
                toast.success(`✅ Deposit of ₹${depositAmount} initiated successfully!`);
                setDepositAmount('');
                setShowDepositModal(false);

                // Refresh wallet data
                setTimeout(() => fetchWalletData(), 1000);
            } else {
                toast.error(result.error || 'Failed to initiate deposit');
            }
        } catch (error) {
            console.error('🔴 Deposit error:', error);
            toast.error('Error processing deposit');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || withdrawAmount <= 0) {
            toast.error('Please enter valid amount');
            return;
        }
        if (withdrawAmount > walletData.available) {
            toast.error('Insufficient available balance');
            return;
        }
        if (!bankAccountId) {
            toast.error('Please select or add bank account');
            return;
        }

        try {
            setLoading(true);
            console.log('🏦 Requesting withdrawal:', withdrawAmount);

            // ✅ POST /wallet/withdraw/request
            const result = await apiService.wallet.requestWithdrawal({
                amount: parseFloat(withdrawAmount),
                currency: 'INR',
                bankAccountId: bankAccountId,
                idempotencyKey: `withdrawal-${Date.now()}`
            });

            console.log('📍 Withdrawal Response:', result);

            if (result.success) {
                toast.success(`✅ Withdrawal of ₹${withdrawAmount} requested! Processing in 1-3 business days.`);
                setWithdrawAmount('');
                setShowWithdrawModal(false);

                // Refresh wallet data
                setTimeout(() => fetchWalletData(), 1000);
            } else {
                toast.error(result.error || 'Failed to request withdrawal');
            }
        } catch (error) {
            console.error('🔴 Withdrawal error:', error);
            toast.error('Error processing withdrawal');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 ml-[290px]">
                    <Header />
                    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                        <div className="text-center">
                            <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading wallet data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaWallet className="text-yellow-600" /> Wallet Management
                                </h1>
                                <p className="text-gray-600 mt-2">Manage your balance, deposits, and withdrawals</p>
                            </div>
                            <button
                                onClick={fetchWalletData}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        {/* Balance Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <BalanceCard
                                title="Total Balance"
                                amount={walletData.balance}
                                color="bg-gradient-to-br from-blue-500 to-blue-600"
                                icon="💰"
                            />
                            <BalanceCard
                                title="Available Balance"
                                amount={walletData.available}
                                color="bg-gradient-to-br from-green-500 to-green-600"
                                icon="✅"
                            />
                            <BalanceCard
                                title="Locked Amount"
                                amount={walletData.locked}
                                color="bg-gradient-to-br from-red-500 to-red-600"
                                icon="🔒"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setShowDepositModal(true)}
                                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
                            >
                                <FaPlus /> Deposit Funds
                            </button>
                            <button
                                onClick={() => setShowWithdrawModal(true)}
                                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                            >
                                <FaMinus /> Withdraw
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-lg card-shadow mb-8">
                            <div className="border-b border-gray-200 flex">
                                {['overview', 'transactions', 'settings'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 font-medium text-center transition ${activeTab === tab
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-gray-600 mb-2">Total Earned</p>
                                                <p className="text-2xl font-bold text-gray-800">
                                                    ₹{walletData.totalEarned.toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">All time earnings</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-gray-600 mb-2">Total Withdrawn</p>
                                                <p className="text-2xl font-bold text-gray-800">
                                                    ₹{walletData.totalWithdrawn.toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">All time withdrawals</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'transactions' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {transactions.map((txn) => (
                                                    <tr key={txn.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-sm text-gray-600">{txn.date}</td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <span className={`inline-flex items-center gap-1 ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                                {txn.type === 'credit' ? <FaPlus size={12} /> : <FaMinus size={12} />}
                                                                {txn.type.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className={`px-4 py-2 text-sm font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{txn.description}</td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-green-700 bg-green-100">
                                                                {txn.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h4 className="font-semibold text-blue-900 mb-2">Security Settings</h4>
                                            <p className="text-sm text-blue-700 mb-4">Configure transaction limits and security options</p>
                                            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                Configure Security &rarr;
                                            </button>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <h4 className="font-semibold text-yellow-900 mb-2">Withdrawal Account</h4>
                                            <p className="text-sm text-yellow-700 mb-4">Bank account for withdrawal requests</p>
                                            <button className="text-yellow-600 hover:text-yellow-800 font-medium text-sm">
                                                Update Bank Account &rarr;
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deposit Modal */}
            {showDepositModal && (
                <Modal
                    title="Deposit Funds"
                    onClose={() => setShowDepositModal(false)}
                    onSubmit={handleDeposit}
                    loading={loading}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="Enter amount"
                                min="100"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="upi">UPI</option>
                                <option value="card">Card</option>
                            </select>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                            ✅ Transaction fee: ₹0 (Free deposit)
                        </div>
                    </div>
                </Modal>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <Modal
                    title="Withdraw Funds"
                    onClose={() => setShowWithdrawModal(false)}
                    onSubmit={handleWithdraw}
                    loading={loading}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="Enter amount"
                                max={walletData.available}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Available: ₹{walletData.available.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                            <input
                                type="text"
                                value={bankAccountId}
                                onChange={(e) => setBankAccountId(e.target.value)}
                                placeholder="Enter bank account ID"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">Contact support to add bank account</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-700">
                            ⏱️ Processing time: 1-3 business days
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const BalanceCard = ({ title, amount, color, icon }) => (
    <div className={`${color} rounded-lg p-6 text-white shadow-lg`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-white/80 text-sm">{title}</p>
                <p className="text-3xl font-bold mt-2">₹{amount.toLocaleString('en-IN')}</p>
            </div>
            <span className="text-3xl">{icon}</span>
        </div>
    </div>
);

const Modal = ({ title, onClose, onSubmit, children, loading = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            <div className="mb-6">{children}</div>
            <div className="flex gap-2">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Submit'
                    )}
                </button>
            </div>
        </div>
    </div>
);



export default VendorWallet;
