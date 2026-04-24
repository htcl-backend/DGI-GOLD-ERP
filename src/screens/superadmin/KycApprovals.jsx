import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../Contexts/DataContext';
import { FaCheck, FaTimes, FaEye, FaDownload, FaExclamationTriangle } from 'react-icons/fa';

const KycApprovals = () => {
    const { allVendors, updateKycStatus } = useData();
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [rejectionNotes, setRejectionNotes] = useState('');

    const pendingKycVendors = allVendors.filter(vendor => vendor.kycStatus === 'pending');
    const verifiedKycVendors = allVendors.filter(vendor => vendor.kycStatus === 'verified');
    const rejectedKycVendors = allVendors.filter(vendor => vendor.kycStatus === 'rejected');

    const filteredVendors = allVendors.filter(vendor => {
        return statusFilter === 'all' ? true : vendor.kycStatus === statusFilter;
    });

    const handleApprove = (vendorId) => {
        updateKycStatus(vendorId, 'verified');
        setShowDetails(false);
    };

    const handleReject = (vendorId) => {
        if (!rejectionNotes) {
            alert('Please provide a reason for rejection in the notes section.');
            return;
        }
        updateKycStatus(vendorId, 'rejected', rejectionNotes);
        setShowDetails(false);
    };

    const handleViewDetails = (vendor) => {
        setSelectedVendor(vendor);
        setRejectionNotes(vendor.rejectionReason || '');
        setShowDetails(true);
    };

    const getKycStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const kycChecklist = [
        { id: 'pan_match', label: 'PAN name matches Bank account name', check: (vendor) => vendor?.bankDetails?.accountName === vendor?.businessName },
        { id: 'gst_active', label: 'GST status is Active (simulated check)', check: (vendor) => !!vendor?.gstin },
        { id: 'no_duplicate', label: 'No duplicate vendor found (simulated check)', check: () => true },
        { id: 'ifsc_valid', label: 'Bank IFSC seems valid (simulated check)', check: (vendor) => vendor?.bankDetails?.ifsc?.length === 11 },
    ];

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-4 sm:mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">KYC Approvals</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">Review and approve vendor KYC documents</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">All</h3>
                                <p className="text-3xl font-bold text-gray-800">{allVendors.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Pending Review</h3>
                                <p className="text-3xl font-bold text-yellow-600">{pendingKycVendors.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Verified</h3>
                                <p className="text-3xl font-bold text-green-600">{verifiedKycVendors.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Rejected</h3>
                                <p className="text-3xl font-bold text-red-600">{rejectedKycVendors.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Total Vendors</h3>
                                <p className="text-3xl font-bold text-blue-600">{allVendors.length}</p>
                            </div>
                        </div>

                        {/* Filter Tabs */}
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

                        {/* KYC Applications Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">KYC Applications</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GSTIN</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredVendors.map((vendor) => (
                                            <tr key={vendor.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">{vendor.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{vendor.businessName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{vendor.gstin || 'Not provided'}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(vendor.kycStatus)}`}>
                                                        {vendor.kycStatus?.toUpperCase() || 'UNKNOWN'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {vendor.documents?.length || 0}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{new Date(vendor.createdAt || Date.now()).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewDetails(vendor)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            View
                                                        </button>
                                                        {vendor.kycStatus === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleViewDetails(vendor)}
                                                                    className="text-green-600 hover:text-green-800 font-medium"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleViewDetails(vendor)}
                                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* KYC Details Modal */}
                        {showDetails && selectedVendor && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-800">KYC Review — {selectedVendor.businessName}</h2>
                                            <button
                                                onClick={() => setShowDetails(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FaTimes size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedVendor.name}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedVendor.email}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedVendor.phone}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedVendor.businessName}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedVendor.gstin}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">KYC Status</label>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(selectedVendor.kycStatus)}`}>
                                                        {selectedVendor.kycStatus?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Approval Checklist</h3>
                                                    <ul className="space-y-2">
                                                        {kycChecklist.map(item => {
                                                            const isChecked = item.check(selectedVendor);
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
                                                {/* Document Section */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Submitted Documents</h3>
                                                    <div className="space-y-2">
                                                        {(selectedVendor.documents || []).map((doc, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{doc}</p>
                                                                </div>
                                                                <button className="text-blue-600 hover:text-blue-800">
                                                                    <FaDownload />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Notes/Rejection Reason */}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes / Rejection Reason</h3>
                                                    <textarea
                                                        value={rejectionNotes}
                                                        onChange={(e) => setRejectionNotes(e.target.value)}
                                                        placeholder="Add notes here. If rejecting, this reason will be sent to the vendor."
                                                        className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    />
                                                    {selectedVendor.kycStatus === 'rejected' && selectedVendor.rejectionReason && (
                                                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                                            <strong>Previous Reason:</strong> {selectedVendor.rejectionReason}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {selectedVendor.kycStatus === 'pending' && (
                                                <div className="flex gap-4 pt-4 border-t mt-6">
                                                    <button
                                                        onClick={() => {
                                                            handleApprove(selectedVendor.id)
                                                        }}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                                                    >
                                                        <FaCheck /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleReject(selectedVendor.id)
                                                        }}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                                                    >
                                                        <FaTimes /> Reject
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

export default KycApprovals;
