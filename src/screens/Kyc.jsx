import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaCheck, FaTimes, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import apiService from './service/apiService';

const Kyc = () => {
    const [pendingKycs, setPendingKycs] = useState([]);
    const [approvedKycs, setApprovedKycs] = useState([]);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [rejectionNotes, setRejectionNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const kycsPerPage = 10;

    useEffect(() => {
        fetchKycData();
    }, [statusFilter]);

    const normalizeKycList = (responseData) => {
        if (Array.isArray(responseData)) {
            return responseData;
        }
        if (responseData?.data && Array.isArray(responseData.data)) {
            return responseData.data;
        }
        if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
            return responseData.data.data;
        }
        return [];
    };

    const fetchKycData = async () => {
        try {
            setLoading(true);
            console.log(`🔄 Fetching ${statusFilter} KYC applications...`);

            const pendingResult = await apiService.kyc.getPending({ page: 1, limit: 20, sortBy: 'submittedAt', sortOrder: 'asc' });
            const approvedResult = await apiService.kyc.getApproved({ page: 1, limit: 20, sortBy: 'reviewedAt', sortOrder: 'desc' });

            if (pendingResult.success) {
                const pendingList = normalizeKycList(pendingResult.data);
                setPendingKycs(pendingList);
                console.log('✅ Pending KYCs loaded:', pendingResult.data);
            } else {
                toast.error('Failed to load pending KYC applications');
            }

            if (approvedResult.success) {
                const approvedList = normalizeKycList(approvedResult.data);
                setApprovedKycs(approvedList);
                console.log('✅ Approved KYCs loaded:', approvedResult.data);
            } else {
                toast.error('Failed to load approved KYC applications');
            }
        } catch (error) {
            console.error('🔴 Error fetching KYC data:', error);
            toast.error('Error loading KYC data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedKyc) return;
        await handleReviewSubmit('APPROVED');
    };

    const handleReject = async () => {
        if (!selectedKyc) return;
        if (!rejectionNotes.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        await handleReviewSubmit('REJECTED');
    };

    const handleReviewSubmit = async (status) => {
        try {
            setIsSubmitting(true);
            console.log(`📤 Submitting KYC review for ${selectedKyc.id}...`);

            const result = await apiService.kyc.reviewKYC(selectedKyc.id, {
                status,
                rejectionReason: status === 'REJECTED' ? rejectionNotes : null,
            });

            if (result.success) {
                toast.success(`KYC ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully!`);
                setShowDetails(false);
                fetchKycData();
            } else {
                toast.error(result.error || 'Failed to review KYC');
            }
        } catch (error) {
            console.error('🔴 Error reviewing KYC:', error);
            toast.error('Error reviewing KYC');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewDetails = (kyc) => {
        setSelectedKyc(kyc);
        setRejectionNotes(kyc.rejectionReason || '');
        setShowDetails(true);
    };

    const getKycStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const kycChecklist = [
        { id: 'pan_match', label: 'PAN name matches bank account name', check: (kyc) => kyc?.bankDetails?.accountName === kyc?.businessName },
        { id: 'gst_active', label: 'GST status is active', check: (kyc) => !!kyc?.gstin },
        { id: 'documents_complete', label: 'All required documents submitted', check: (kyc) => kyc?.documents && Object.values(kyc.documents).filter(d => d).length >= 3 },
        { id: 'ifsc_valid', label: 'Bank IFSC seems valid', check: (kyc) => kyc?.bankDetails?.ifsc?.length === 11 },
    ];

    const filteredKycs = statusFilter === 'all'
        ? [...pendingKycs, ...approvedKycs]
        : statusFilter === 'pending'
            ? pendingKycs
            : statusFilter === 'verified'
                ? approvedKycs
                : [];

    const totalPages = Math.max(1, Math.ceil(filteredKycs.length / kycsPerPage));
    const paginatedKycs = filteredKycs.slice((currentPage - 1) * kycsPerPage, currentPage * kycsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, pendingKycs.length, approvedKycs.length]);

    const handleKycPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-72 overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-4 sm:mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">KYC Approvals</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">Review and approve vendor KYC documents</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">All</h3>
                                <p className="text-3xl font-bold text-gray-800">{pendingKycs.length + approvedKycs.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Pending Review</h3>
                                <p className="text-3xl font-bold text-yellow-600">{pendingKycs.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Verified</h3>
                                <p className="text-3xl font-bold text-green-600">{approvedKycs.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Rejected</h3>
                                <p className="text-3xl font-bold text-red-600">0</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Total KYCs</h3>
                                <p className="text-3xl font-bold text-blue-600">{pendingKycs.length + approvedKycs.length}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-6">
                            {['all', 'pending', 'verified', 'rejected'].map((state) => (
                                <button
                                    key={state}
                                    onClick={() => setStatusFilter(state)}
                                    className={`px-4 py-2 rounded-lg border ${statusFilter === state ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-300'}`}>
                                    {state === 'all' ? 'All' : state.charAt(0).toUpperCase() + state.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">KYC Applications</h3>
                            </div>
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Loading KYC applications...</p>
                                    </div>
                                ) : filteredKycs.length === 0 ? (
                                    <div className="p-8 text-center text-gray-600">
                                        <p>No KYC applications found.</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GSTIN</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedKycs.map((kyc) => (
                                                <tr key={kyc.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{kyc.vendorName || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{kyc.businessName || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{kyc.gstin || 'Not provided'}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(kyc.status)}`}>
                                                            {kyc.status?.toUpperCase() || 'UNKNOWN'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(kyc.createdAt || Date.now()).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <button onClick={() => handleViewDetails(kyc)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                                                            <FaEye /> View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {filteredKycs.length > kycsPerPage && (
                                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <button
                                        onClick={() => handleKycPageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <span>Page</span>
                                        <span className="font-semibold">{currentPage}</span>
                                        <span>of</span>
                                        <span className="font-semibold">{totalPages}</span>
                                    </div>
                                    <button
                                        onClick={() => handleKycPageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>

                        {showDetails && selectedKyc && (
                            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-800">KYC Review — {selectedKyc.businessName}</h2>
                                            <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700"><FaTimes size={24} /></button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedKyc.vendorName || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedKyc.email || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedKyc.phone || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedKyc.businessName || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedKyc.gstin || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">KYC Status</label>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(selectedKyc.status)}`}>
                                                        {selectedKyc.status?.toUpperCase() || 'UNKNOWN'}
                                                    </span>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Approval Checklist</h3>
                                                    <ul className="space-y-2">
                                                        {kycChecklist.map(item => {
                                                            const isChecked = item.check(selectedKyc);
                                                            return (
                                                                <li key={item.id} className={`flex items-center p-2 rounded-lg ${isChecked ? 'bg-green-50' : 'bg-red-50'}`}>
                                                                    {isChecked ? <FaCheck className="text-green-500 mr-3" /> : <FaExclamationTriangle className="text-red-500 mr-3" />}
                                                                    <span className="text-sm text-gray-700">{item.label}</span>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h3>
                                                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                                                        <p><strong>Account Name:</strong> {selectedKyc.bankDetails?.accountName || 'N/A'}</p>
                                                        <p><strong>Account Number:</strong> {selectedKyc.bankDetails?.accountNumber || 'N/A'}</p>
                                                        <p><strong>IFSC Code:</strong> {selectedKyc.bankDetails?.ifsc || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes / Rejection Reason</h3>
                                                    <textarea
                                                        value={rejectionNotes}
                                                        onChange={(e) => setRejectionNotes(e.target.value)}
                                                        placeholder="Add notes here. If rejecting, this reason will be sent to the vendor."
                                                        className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                        disabled={selectedKyc.status?.toUpperCase() !== 'PENDING'}
                                                    />
                                                    {selectedKyc.status?.toUpperCase() === 'REJECTED' && selectedKyc.rejectionReason && (
                                                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                                            <strong>Previous Reason:</strong> {selectedKyc.rejectionReason}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {selectedKyc.status?.toUpperCase() === 'PENDING' && (
                                                <div className="flex gap-4 pt-4 border-t mt-6">
                                                    <button onClick={handleApprove} disabled={isSubmitting} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:bg-gray-400">
                                                        <FaCheck /> {isSubmitting ? 'Processing...' : 'Approve'}
                                                    </button>
                                                    <button onClick={handleReject} disabled={isSubmitting} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 disabled:bg-gray-400">
                                                        <FaTimes /> {isSubmitting ? 'Processing...' : 'Reject'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kyc;
