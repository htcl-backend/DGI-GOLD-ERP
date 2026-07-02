// import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import { FaCheck, FaTimes, FaEye, FaExclamationTriangle } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import apiService from './service/apiService';

// const Kyc = () => {
//     const [pendingKycs, setPendingKycs] = useState([]);
//     const [approvedKycs, setApprovedKycs] = useState([]);
//     const [rejectedKycs, setRejectedKycs] = useState([]);
//     const [selectedKyc, setSelectedKyc] = useState(null);
//     const [showDetails, setShowDetails] = useState(false);
//     const [statusFilter, setStatusFilter] = useState('pending');
//     const [rejectionNotes, setRejectionNotes] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const kycsPerPage = 10;

//     useEffect(() => {
//         fetchKycData();
//     }, [statusFilter]);

//     const normalizeKycList = (responseData) => {
//         if (Array.isArray(responseData)) {
//             return responseData;
//         }
//         if (responseData?.data && Array.isArray(responseData.data)) {
//             return responseData.data;
//         }
//         if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
//             return responseData.data.data;
//         }
//         return [];
//     };

//     const getKycValue = (kyc, ...keys) => {
//         for (const key of keys) {
//             const value = key.split('.').reduce((obj, prop) => obj?.[prop], kyc);
//             if (value !== undefined && value !== null && value !== '') {
//                 return value;
//             }
//         }
//         return 'N/A';
//     };

//     const getKycName = (kyc) => {
//         const firstName = getKycValue(kyc, 'customerInfo.firstName', 'vendor.firstName');
//         const lastName = getKycValue(kyc, 'customerInfo.lastName', 'vendor.lastName');
//         const fullName = [firstName, lastName].filter((value) => value && value !== 'N/A').join(' ');
//         return fullName || getKycValue(kyc, 'vendorName', 'vendor.name', 'customerInfo.name', 'businessName', 'vendor.companyName');
//     };

//     const getKycBusinessName = (kyc) => {
//         return getKycValue(
//             kyc,
//             'businessName',
//             'vendor.businessName',
//             'vendor.companyName',
//             'customerInfo.businessName',
//             'customerInfo.companyName',
//             'customerInfo.entityName',
//             'customerInfo.name'
//         );
//     };

//     const getKycGstin = (kyc) => {
//         const value = getKycValue(kyc, 'gstin', 'taxId', 'gstNumber');
//         return value === 'N/A' ? 'Not provided' : value;
//     };

//     const getKycStatus = (kyc) => getKycValue(kyc, 'status', 'kycStatus', 'applicationStatus');

//     const fetchKycData = async () => {
//         try {
//             setLoading(true);
//             console.log(`🔄 Fetching ${statusFilter} KYC applications...`);

//             const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
//                 apiService.kyc.getPending({ page: 1, limit: 20, sortBy: 'submittedAt', sortOrder: 'asc' }),
//                 apiService.kyc.getApproved({ page: 1, limit: 20, sortBy: 'reviewedAt', sortOrder: 'desc' }),
//                 apiService.kyc.getRejected({ page: 1, limit: 20, sortBy: 'reviewedAt', sortOrder: 'desc' }),
//             ]);

//             if (pendingResult.success) {
//                 const pendingList = normalizeKycList(pendingResult.data);
//                 setPendingKycs(pendingList);
//                 console.log('✅ Pending KYCs loaded:', pendingResult.data);
//             } else {
//                 toast.error('Failed to load pending KYC applications');
//             }

//             if (approvedResult.success) {
//                 const approvedList = normalizeKycList(approvedResult.data);
//                 setApprovedKycs(approvedList);
//                 console.log('✅ Approved KYCs loaded:', approvedResult.data);
//             } else {
//                 toast.error('Failed to load approved KYC applications');
//             }

//             if (rejectedResult.success) {
//                 const rejectedList = normalizeKycList(rejectedResult.data);
//                 setRejectedKycs(rejectedList);
//                 console.log('✅ Rejected KYCs loaded:', rejectedResult.data);
//             } else {
//                 console.warn('⚠️ Failed to load rejected KYC applications', rejectedResult.error || rejectedResult);
//             }
//         } catch (error) {
//             console.error('🔴 Error fetching KYC data:', error);
//             toast.error('Error loading KYC data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleApprove = async () => {
//         if (!selectedKyc) return;
//         await handleReviewSubmit('APPROVED');
//     };

//     const handleReject = async () => {
//         if (!selectedKyc) return;
//         if (!rejectionNotes.trim()) {
//             toast.error('Please provide a reason for rejection');
//             return;
//         }
//         await handleReviewSubmit('REJECTED');
//     };

//     const handleReviewSubmit = async (status) => {
//         try {
//             setIsSubmitting(true);
//             console.log(`📤 Submitting KYC review for ${selectedKyc.id}...`);

//             const result = await apiService.kyc.reviewKYC(selectedKyc.id, {
//                 status,
//                 rejectionReason: status === 'REJECTED' ? rejectionNotes : null,
//             });

//             if (result.success) {
//                 toast.success(`KYC ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully!`);
//                 setShowDetails(false);
//                 fetchKycData();
//             } else {
//                 toast.error(result.error || 'Failed to review KYC');
//             }
//         } catch (error) {
//             console.error('🔴 Error reviewing KYC:', error);
//             toast.error('Error reviewing KYC');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleViewDetails = (kyc) => {
//         setSelectedKyc(kyc);
//         setRejectionNotes(kyc.rejectionReason || '');
//         setShowDetails(true);
//     };

//     const getKycStatusColor = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'approved':
//             case 'verified':
//                 return 'text-green-600 bg-green-100';
//             case 'pending':
//                 return 'text-yellow-600 bg-yellow-100';
//             case 'rejected':
//                 return 'text-red-600 bg-red-100';
//             default:
//                 return 'text-gray-600 bg-gray-100';
//         }
//     };

//     const kycChecklist = [
//         { id: 'pan_match', label: 'PAN name matches bank account name', check: (kyc) => kyc?.bankDetails?.accountName === kyc?.businessName },
//         { id: 'gst_active', label: 'GST status is active', check: (kyc) => !!kyc?.gstin },
//         { id: 'documents_complete', label: 'All required documents submitted', check: (kyc) => kyc?.documents && Object.values(kyc.documents).filter(d => d).length >= 3 },
//         { id: 'ifsc_valid', label: 'Bank IFSC seems valid', check: (kyc) => kyc?.bankDetails?.ifsc?.length === 11 },
//     ];

//     const filteredKycs = statusFilter === 'all'
//         ? [...pendingKycs, ...approvedKycs, ...rejectedKycs]
//         : statusFilter === 'pending'
//             ? pendingKycs
//             : statusFilter === 'verified'
//                 ? approvedKycs
//                 : statusFilter === 'rejected'
//                     ? rejectedKycs
//                     : [];

//     const totalPages = Math.max(1, Math.ceil(filteredKycs.length / kycsPerPage));
//     const paginatedKycs = filteredKycs.slice((currentPage - 1) * kycsPerPage, currentPage * kycsPerPage);

//     React.useEffect(() => {
//         setCurrentPage(1);
//     }, [statusFilter, pendingKycs.length, approvedKycs.length, rejectedKycs.length]);

//     const handleKycPageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     return (
//         <div className="flex min-h-screen">
//             <Sidebar />
//             <div className="flex-1 ml-72 overflow-x-hidden">
//                 <Header />
//                 <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="mb-4 sm:mb-6">
//                             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">KYC Approvals</h1>
//                             <p className="text-sm sm:text-base text-gray-600 mt-2">Review and approve vendor KYC documents</p>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-6">
//                             <div className="bg-white rounded-lg shadow-md p-6">
//                                 <h3 className="text-lg font-semibold text-gray-800">All</h3>
//                                 <p className="text-3xl font-bold text-gray-800">{pendingKycs.length + approvedKycs.length}</p>
//                             </div>
//                             <div className="bg-white rounded-lg shadow-md p-6">
//                                 <h3 className="text-lg font-semibold text-gray-800">Pending Review</h3>
//                                 <p className="text-3xl font-bold text-yellow-600">{pendingKycs.length}</p>
//                             </div>
//                             <div className="bg-white rounded-lg shadow-md p-6">
//                                 <h3 className="text-lg font-semibold text-gray-800">Verified</h3>
//                                 <p className="text-3xl font-bold text-green-600">{approvedKycs.length}</p>
//                             </div>
//                             <div className="bg-white rounded-lg shadow-md p-6">
//                                 <h3 className="text-lg font-semibold text-gray-800">Rejected</h3>
//                                 <p className="text-3xl font-bold text-red-600">{rejectedKycs.length}</p>
//                             </div>
//                             <div className="bg-white rounded-lg shadow-md p-6">
//                                 <h3 className="text-lg font-semibold text-gray-800">Total KYCs</h3>
//                                 <p className="text-3xl font-bold text-blue-600">{pendingKycs.length + approvedKycs.length + rejectedKycs.length}</p>
//                             </div>
//                         </div>

//                         <div className="flex gap-2 mb-6">
//                             {['all', 'pending', 'verified', 'rejected'].map((state) => (
//                                 <button
//                                     key={state}
//                                     onClick={() => setStatusFilter(state)}
//                                     className={`px-4 py-2 rounded-lg border ${statusFilter === state ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-300'}`}>
//                                     {state === 'all' ? 'All' : state.charAt(0).toUpperCase() + state.slice(1)}
//                                 </button>
//                             ))}
//                         </div>

//                         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                             <div className="px-6 py-4 border-b border-gray-200">
//                                 <h3 className="text-lg font-semibold text-gray-800">KYC Applications</h3>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 {loading ? (
//                                     <div className="p-8 text-center">
//                                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
//                                         <p className="mt-4 text-gray-600">Loading KYC applications...</p>
//                                     </div>
//                                 ) : filteredKycs.length === 0 ? (
//                                     <div className="p-8 text-center text-gray-600">
//                                         <p>No KYC applications found.</p>
//                                     </div>
//                                 ) : (
//                                     <table className="w-full">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Name</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GSTIN</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-200">
//                                             {paginatedKycs.map((kyc) => (
//                                                 <tr key={kyc.id} className="hover:bg-gray-50">
//                                                     <td className="px-6 py-4 text-sm text-gray-900">{getKycName(kyc)}</td>
//                                                     <td className="px-6 py-4 text-sm text-gray-900">{getKycBusinessName(kyc)}</td>
//                                                     <td className="px-6 py-4 text-sm text-gray-900">{getKycGstin(kyc)}</td>
//                                                     <td className="px-6 py-4 text-sm">
//                                                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(getKycStatus(kyc).toString())}`}>
//                                                             {getKycStatus(kyc).toString().toUpperCase()}
//                                                         </span>
//                                                     </td>
//                                                     <td className="px-6 py-4 text-sm text-gray-900">{new Date(kyc.createdAt || kyc.submittedAt || Date.now()).toLocaleDateString()}</td>
//                                                     <td className="px-6 py-4 text-sm">
//                                                         <button onClick={() => handleViewDetails(kyc)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
//                                                             <FaEye /> View Details
//                                                         </button>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 )}
//                             </div>
//                             {filteredKycs.length > kycsPerPage && (
//                                 <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
//                                     <button
//                                         onClick={() => handleKycPageChange(currentPage - 1)}
//                                         disabled={currentPage === 1}
//                                         className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//                                     >
//                                         Previous
//                                     </button>
//                                     <div className="flex items-center gap-2 text-sm text-gray-700">
//                                         <span>Page</span>
//                                         <span className="font-semibold">{currentPage}</span>
//                                         <span>of</span>
//                                         <span className="font-semibold">{totalPages}</span>
//                                     </div>
//                                     <button
//                                         onClick={() => handleKycPageChange(currentPage + 1)}
//                                         disabled={currentPage === totalPages}
//                                         className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//                                     >
//                                         Next
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {showDetails && selectedKyc && (
//                             <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//                                 <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//                                     <div className="p-6">
//                                         <div className="flex justify-between items-center mb-6">
//                                             <h2 className="text-2xl font-bold text-gray-800">KYC Review — {selectedKyc.businessName}</h2>
//                                             <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700"><FaTimes size={24} /></button>
//                                         </div>

//                                         <div className="space-y-6">
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
//                                                     <p className="mt-1 text-sm text-gray-900">{getKycName(selectedKyc)}</p>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700">Email</label>
//                                                     <p className="mt-1 text-sm text-gray-900">{getKycValue(selectedKyc, 'email', 'vendor.email', 'customerInfo.email', 'contactEmail')}</p>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700">Phone</label>
//                                                     <p className="mt-1 text-sm text-gray-900">{getKycValue(selectedKyc, 'phone', 'vendor.phone', 'customerInfo.phone', 'contactPhone')}</p>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700">Business Name</label>
//                                                     <p className="mt-1 text-sm text-gray-900">{getKycBusinessName(selectedKyc)}</p>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700">GSTIN</label>
//                                                     <p className="mt-1 text-sm text-gray-900">{getKycGstin(selectedKyc)}</p>
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700">KYC Status</label>
//                                                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(getKycStatus(selectedKyc).toString())}`}>
//                                                         {getKycStatus(selectedKyc).toString().toUpperCase()}
//                                                     </span>
//                                                 </div>
//                                                 <div className="md:col-span-3">
//                                                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Approval Checklist</h3>
//                                                     <ul className="space-y-2">
//                                                         {kycChecklist.map(item => {
//                                                             const isChecked = item.check(selectedKyc);
//                                                             return (
//                                                                 <li key={item.id} className={`flex items-center p-2 rounded-lg ${isChecked ? 'bg-green-50' : 'bg-red-50'}`}>
//                                                                     {isChecked ? <FaCheck className="text-green-500 mr-3" /> : <FaExclamationTriangle className="text-red-500 mr-3" />}
//                                                                     <span className="text-sm text-gray-700">{item.label}</span>
//                                                                 </li>
//                                                             );
//                                                         })}
//                                                     </ul>
//                                                 </div>
//                                             </div>

//                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
//                                                 <div>
//                                                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h3>
//                                                     <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
//                                                         <p><strong>Account Name:</strong> {selectedKyc.bankDetails?.accountName || 'N/A'}</p>
//                                                         <p><strong>Account Number:</strong> {selectedKyc.bankDetails?.accountNumber || 'N/A'}</p>
//                                                         <p><strong>IFSC Code:</strong> {selectedKyc.bankDetails?.ifsc || 'N/A'}</p>
//                                                     </div>
//                                                 </div>

//                                                 <div>
//                                                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes / Rejection Reason</h3>
//                                                     <textarea
//                                                         value={rejectionNotes}
//                                                         onChange={(e) => setRejectionNotes(e.target.value)}
//                                                         placeholder="Add notes here. If rejecting, this reason will be sent to the vendor."
//                                                         className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                                                         disabled={selectedKyc.status?.toUpperCase() !== 'PENDING'}
//                                                     />
//                                                     {selectedKyc.status?.toUpperCase() === 'REJECTED' && selectedKyc.rejectionReason && (
//                                                         <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
//                                                             <strong>Previous Reason:</strong> {selectedKyc.rejectionReason}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             {selectedKyc.status?.toUpperCase() === 'PENDING' && (
//                                                 <div className="flex gap-4 pt-4 border-t mt-6">
//                                                     <button onClick={handleApprove} disabled={isSubmitting} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:bg-gray-400">
//                                                         <FaCheck /> {isSubmitting ? 'Processing...' : 'Approve'}
//                                                     </button>
//                                                     <button onClick={handleReject} disabled={isSubmitting} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 disabled:bg-gray-400">
//                                                         <FaTimes /> {isSubmitting ? 'Processing...' : 'Reject'}
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Kyc;
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaCheck, FaTimes, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import apiService from './service/apiService';

const Kyc = () => {
    const [pendingKycs, setPendingKycs] = useState([]);
    const [approvedKycs, setApprovedKycs] = useState([]);
    const [rejectedKycs, setRejectedKycs] = useState([]);
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

    const getKycValue = (kyc, ...keys) => {
        for (const key of keys) {
            const value = key.split('.').reduce((obj, prop) => obj?.[prop], kyc);
            if (value !== undefined && value !== null && value !== '') {
                return value;
            }
        }
        return 'N/A';
    };

    // ✅ NEW: robust ID getter — backend may use id / _id / kycId / vendorId etc.
    // This fixes Approve/Reject silently failing if selectedKyc.id was undefined.
    const getKycId = (kyc) => {
        const raw = getKycValue(kyc, 'id', '_id', 'kycId', 'kycApplicationId', 'vendorId', 'vendor.id', 'vendor._id', 'applicationId');
        return raw === 'N/A' ? null : raw;
    };

    const getKycName = (kyc) => {
        const firstName = getKycValue(kyc, 'customerInfo.firstName', 'vendor.firstName');
        const lastName = getKycValue(kyc, 'customerInfo.lastName', 'vendor.lastName');
        const fullName = [firstName, lastName].filter((value) => value && value !== 'N/A').join(' ');
        return fullName || getKycValue(kyc, 'vendorName', 'vendor.name', 'customerInfo.name', 'businessName', 'vendor.companyName');
    };

    const getKycBusinessName = (kyc) => {
        return getKycValue(
            kyc,
            'businessName',
            'vendor.businessName',
            'vendor.companyName',
            'customerInfo.businessName',
            'customerInfo.companyName',
            'customerInfo.entityName',
            'customerInfo.name'
        );
    };

    const getKycGstin = (kyc) => {
        const value = getKycValue(kyc, 'gstin', 'taxId', 'gstNumber', 'gstDetails.gstin', 'documents.gstin');
        return value === 'N/A' ? 'Not provided' : value;
    };

    const getKycStatus = (kyc) => getKycValue(kyc, 'status', 'kycStatus', 'applicationStatus');

    // ✅ NEW: robust bank-detail getters — tries several possible nesting paths.
    // If your backend uses a different path than all of these, paste me one
    // console.log("🔍 FULL KYC OBJECT") output and I'll add the exact path.
    const getKycBankAccountName = (kyc) => getKycValue(
        kyc,
        'bankDetails.accountName',
        'bankAccount.accountName',
        'bankAccount.accountHolderName',
        'bankDetails.accountHolderName',
        'vendor.bankDetails.accountName',
        'kycDocuments.bankDetails.accountName',
        'documents.bankDetails.accountName'
    );

    const getKycBankAccountNumber = (kyc) => getKycValue(
        kyc,
        'bankDetails.accountNumber',
        'bankAccount.accountNumber',
        'vendor.bankDetails.accountNumber',
        'kycDocuments.bankDetails.accountNumber',
        'documents.bankDetails.accountNumber'
    );

    const getKycIfsc = (kyc) => getKycValue(
        kyc,
        'bankDetails.ifsc',
        'bankDetails.ifscCode',
        'bankAccount.ifsc',
        'bankAccount.ifscCode',
        'vendor.bankDetails.ifsc',
        'kycDocuments.bankDetails.ifsc',
        'documents.bankDetails.ifsc'
    );

    const fetchKycData = async () => {
        try {
            setLoading(true);
            console.log(`🔄 Fetching ${statusFilter} KYC applications...`);

            const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
                apiService.kyc.getPending({ page: 1, limit: 20, sortBy: 'submittedAt', sortOrder: 'asc' }),
                apiService.kyc.getApproved({ page: 1, limit: 20, sortBy: 'reviewedAt', sortOrder: 'desc' }),
                apiService.kyc.getRejected({ page: 1, limit: 20, sortBy: 'reviewedAt', sortOrder: 'desc' }),
            ]);

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

            if (rejectedResult.success) {
                const rejectedList = normalizeKycList(rejectedResult.data);
                setRejectedKycs(rejectedList);
                console.log('✅ Rejected KYCs loaded:', rejectedResult.data);
            } else {
                console.warn('⚠️ Failed to load rejected KYC applications', rejectedResult.error || rejectedResult);
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

    // const handleReviewSubmit = async (status) => {
    //     const kycId = getKycId(selectedKyc);

    //     // ✅ Guard: if we can't resolve a real ID, stop and tell you loudly
    //     // instead of silently calling the API with "undefined".
    //     if (!kycId) {
    //         console.error('🔴 Could not resolve a KYC id from selectedKyc:', selectedKyc);
    //         toast.error('Cannot submit: KYC ID not found. Check console for the raw object.');
    //         return;
    //     }

    //     try {
    //         setIsSubmitting(true);
    //         console.log(`📤 Submitting KYC review for ${kycId}, status=${status}...`);

    //         const result = await apiService.kyc.reviewKYC(kycId, {
    //             status,
    //             rejectionReason: status === 'REJECTED' ? rejectionNotes : null,
    //         });

    //         console.log('📥 Review submit response:', result);

    //         if (result.success) {
    //             toast.success(`KYC ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully!`);
    //             setShowDetails(false);
    //             fetchKycData();
    //         } else {
    //             // ✅ Surface the real backend error instead of a generic message
    //             toast.error(result.error || result.message || 'Failed to review KYC');
    //             console.error('🔴 Review submit failed:', result);
    //         }
    //     } catch (error) {
    //         console.error('🔴 Error reviewing KYC:', error);
    //         toast.error(error.message || 'Error reviewing KYC');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };
    const handleReviewSubmit = async (status) => {
        const kycId = getKycId(selectedKyc);

        if (!kycId) {
            console.error('🔴 Could not resolve a KYC id from selectedKyc:', selectedKyc);
            toast.error('Cannot submit: KYC ID not found. Check console for the raw object.');
            return;
        }

        const decisionValue = status.toLowerCase(); // 'approved' or 'rejected'

        const payload = {
            decision: decisionValue,
            reason: rejectionNotes || '', // always send this key — backend errors on undefined
        };

        try {
            setIsSubmitting(true);
            console.log(`📤 Submitting KYC review for ${kycId}, payload:`, payload);

            const result = await apiService.kyc.reviewKYC(kycId, payload);

            console.log('📥 Review submit response:', result);

            if (result.success) {
                toast.success(`KYC ${decisionValue === 'approved' ? 'approved' : 'rejected'} successfully!`);
                setShowDetails(false);
                fetchKycData();
            } else {
                toast.error(result.error || result.message || 'Failed to review KYC');
                console.error('🔴 Review submit failed:', result);
            }
        } catch (error) {
            console.error('🔴 Error reviewing KYC:', error);
            toast.error(error.message || 'Error reviewing KYC');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleViewDetails = (kyc) => {
        console.log('🔍 FULL KYC OBJECT:', JSON.stringify(kyc, null, 2));
        setSelectedKyc(kyc);
        setRejectionNotes(kyc.rejectionReason || '');
        setShowDetails(true);
    };
    const getKycStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'verified':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'rejected':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    // ✅ Checklist now uses the robust getters instead of hardcoded paths
    const kycChecklist = [
        {
            id: 'pan_match',
            label: 'PAN name matches bank account name',
            check: (kyc) => {
                const bankName = getKycBankAccountName(kyc);
                const businessName = getKycBusinessName(kyc);
                return bankName !== 'N/A' && businessName !== 'N/A' &&
                    bankName.toString().trim().toLowerCase() === businessName.toString().trim().toLowerCase();
            },
        },
        {
            id: 'gst_active',
            label: 'GST status is active',
            check: (kyc) => getKycGstin(kyc) !== 'Not provided' && getKycGstin(kyc) !== 'N/A',
        },
        {
            id: 'documents_complete',
            label: 'All required documents submitted',
            check: (kyc) => {
                const docs = kyc?.documents || kyc?.kycDocuments || kyc?.vendor?.documents;
                return docs && Object.values(docs).filter((d) => d).length >= 3;
            },
        },
        {
            id: 'ifsc_valid',
            label: 'Bank IFSC seems valid',
            check: (kyc) => {
                const ifsc = getKycIfsc(kyc);
                return ifsc !== 'N/A' && ifsc.toString().length === 11;
            },
        },
    ];
    const isVendorKyc = (kyc) => getKycValue(kyc, 'entityType') === 'VENDOR' || !!kyc?.businessName || !!kyc?.bankDetails;

    const getKycDocuments = (kyc) => {
        const docs = kyc?.documents || kyc?.kycDocuments;
        return Array.isArray(docs) ? docs : [];
    };

    const filteredKycs = statusFilter === 'all'
        ? [...pendingKycs, ...approvedKycs, ...rejectedKycs]
        : statusFilter === 'pending'
            ? pendingKycs
            : statusFilter === 'verified'
                ? approvedKycs
                : statusFilter === 'rejected'
                    ? rejectedKycs
                    : [];

    const totalPages = Math.max(1, Math.ceil(filteredKycs.length / kycsPerPage));
    const paginatedKycs = filteredKycs.slice((currentPage - 1) * kycsPerPage, currentPage * kycsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, pendingKycs.length, approvedKycs.length, rejectedKycs.length]);

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
                                <p className="text-3xl font-bold text-red-600">{rejectedKycs.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Total KYCs</h3>
                                <p className="text-3xl font-bold text-blue-600">{pendingKycs.length + approvedKycs.length + rejectedKycs.length}</p>
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
                                                <tr key={getKycId(kyc) || kyc.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{getKycName(kyc)}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{getKycBusinessName(kyc)}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{getKycGstin(kyc)}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(getKycStatus(kyc).toString())}`}>
                                                            {getKycStatus(kyc).toString().toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(kyc.createdAt || kyc.submittedAt || Date.now()).toLocaleDateString()}</td>
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
                                            <h2 className="text-2xl font-bold text-gray-800">KYC Review — {getKycBusinessName(selectedKyc)}</h2>
                                            <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700"><FaTimes size={24} /></button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                                                    {/* <p className="mt-1 text-sm text-gray-900">{getKycName(selectedKyc)}</p> */}
                                                    <p className="mt-1 text-sm text-gray-900">{getKycValue(selectedKyc, 'phone', 'phoneNumber', 'vendor.phone', 'customerInfo.phoneNumber', 'contactPhone')}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                                    <p className="mt-1 text-sm text-gray-900">{getKycValue(selectedKyc, 'email', 'vendor.email', 'customerInfo.email', 'contactEmail')}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                    <p className="mt-1 text-sm text-gray-900">{getKycValue(selectedKyc, 'phone', 'vendor.phone', 'customerInfo.phone', 'contactPhone')}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                                    <p className="mt-1 text-sm text-gray-900">{getKycBusinessName(selectedKyc)}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                                                    <p className="mt-1 text-sm text-gray-900">{getKycGstin(selectedKyc)}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">KYC Status</label>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(getKycStatus(selectedKyc).toString())}`}>
                                                        {getKycStatus(selectedKyc).toString().toUpperCase()}
                                                    </span>
                                                </div>
                                                {/* <div className="md:col-span-3">
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
                                                </div> */}

                                                <div className="md:col-span-3">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Approval Checklist</h3>
                                                    <ul className="space-y-2">
                                                        {(isVendorKyc(selectedKyc)
                                                            ? kycChecklist
                                                            : kycChecklist.filter(item => item.id === 'documents_complete')
                                                        ).map(item => {
                                                            const isChecked = item.check(selectedKyc);
                                                            return (
                                                                <li key={item.id} className={`flex items-center p-2 rounded-lg ${isChecked ? 'bg-green-50' : 'bg-red-50'}`}>
                                                                    {isChecked ? <FaCheck className="text-green-500 mr-3" /> : <FaExclamationTriangle className="text-red-500 mr-3" />}
                                                                    <span className="text-sm text-gray-700">{item.label}</span>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                    {!isVendorKyc(selectedKyc) && (
                                                        <p className="text-xs text-gray-500 mt-2">This is a customer identity KYC — business/bank checks don't apply.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h3>
                                                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                                                        <p><strong>Account Name:</strong> {getKycBankAccountName(selectedKyc)}</p>
                                                        <p><strong>Account Number:</strong> {getKycBankAccountNumber(selectedKyc)}</p>
                                                        <p><strong>IFSC Code:</strong> {getKycIfsc(selectedKyc)}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes / Rejection Reason</h3>
                                                    <textarea
                                                        value={rejectionNotes}
                                                        onChange={(e) => setRejectionNotes(e.target.value)}
                                                        placeholder="Add notes here. If rejecting, this reason will be sent to the vendor."
                                                        className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                        disabled={getKycStatus(selectedKyc).toString().toUpperCase() !== 'PENDING'}
                                                    />
                                                    {getKycStatus(selectedKyc).toString().toUpperCase() === 'REJECTED' && selectedKyc.rejectionReason && (
                                                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                                            <strong>Previous Reason:</strong> {selectedKyc.rejectionReason}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {getKycStatus(selectedKyc).toString().toUpperCase() === 'PENDING' && (
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