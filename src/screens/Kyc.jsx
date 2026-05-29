import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../Contexts/AuthContext';
import { FaCheckCircle, FaClock, FaTimesCircle, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import apiService from './service/apiService';

const Kyc = () => {
    const { user } = useAuth();
    const [vendorData, setVendorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        businessName: '',
        gstin: '',
        address: '',
        bankDetails: {
            accountName: '',
            accountNumber: '',
            ifsc: ''
        },
        documents: {
            pan: null,
            gst: null,
            cheque: null,
            registration: null,
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch vendor profile from API
    useEffect(() => {
        const fetchVendorProfile = async () => {
            try {
                setLoading(true);
                console.log('🔄 Fetching vendor profile for KYC...');

                const result = await apiService.vendor.getProfile();
                console.log('📦 Vendor Profile Response:', result);

                if (result.success && result.data) {
                    const profileData = result.data.data || result.data;
                    setVendorData(profileData);

                    // Populate form with existing data
                    setFormData({
                        businessName: profileData.businessName || '',
                        gstin: profileData.gstin || '',
                        address: profileData.address || '',
                        bankDetails: profileData.bankDetails || { accountName: '', accountNumber: '', ifsc: '' },
                        documents: { pan: null, gst: null, cheque: null, registration: null }
                    });
                    console.log('✅ Vendor profile loaded');
                } else {
                    console.warn('⚠️ Failed to fetch vendor profile:', result.error);
                    toast.error('Failed to load vendor profile');
                }
            } catch (error) {
                console.error('🔴 Error fetching vendor profile:', error);
                toast.error('Error loading KYC data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchVendorProfile();
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBankDetailsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            bankDetails: {
                ...prev.bankDetails,
                [name]: value
            }
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [name]: files[0]
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('📤 Submitting KYC data...');

            // Prepare data for submission
            const submitData = {
                businessName: formData.businessName,
                gstin: formData.gstin,
                address: formData.address,
                bankDetails: formData.bankDetails,
                kycStatus: 'pending'
            };

            // Call API to update KYC
            const result = await apiService.vendor.updateProfile(submitData);
            console.log('📦 KYC Submission Response:', result);

            if (result.success) {
                toast.success('KYC details submitted for verification!');
                // Update local vendor data
                setVendorData({
                    ...vendorData,
                    ...submitData
                });
            } else {
                toast.error(result.error || 'Failed to submit KYC');
            }
        } catch (error) {
            console.error('🔴 Error submitting KYC:', error);
            toast.error('Error submitting KYC details');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-72 overflow-x-hidden">
                    <Header />
                    <div className="p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading KYC information...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!vendorData) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-72 overflow-x-hidden">
                    <Header />
                    <div className="p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)]">
                        <div className="text-center text-red-600">
                            <p>Failed to load vendor profile. Please try again.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isEditable = vendorData.kycStatus !== 'verified' && vendorData.kycStatus !== 'pending';

    const renderStatusBanner = () => {
        switch (vendorData.kycStatus) {
            case 'verified':
                return (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg">
                        <div className="flex items-center">
                            <FaCheckCircle className="mr-3" />
                            <p className="font-bold">Your KYC is Verified.</p>
                        </div>
                        <p>All features are unlocked. No further action is required.</p>
                    </div>
                );
            case 'pending':
                return (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg">
                        <div className="flex items-center">
                            <FaClock className="mr-3" />
                            <p className="font-bold">Your KYC is Pending Review.</p>
                        </div>
                        <p>Our team is reviewing your documents. This usually takes 1-2 business days.</p>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
                        <div className="flex items-center">
                            <FaTimesCircle className="mr-3" />
                            <p className="font-bold">Your KYC was Rejected.</p>
                        </div>
                        <p><strong>Reason:</strong> {vendorData.rejectionReason || 'Please review your details and re-submit.'}</p>
                    </div>
                );
            default:
                return (
                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-r-lg">
                        <p className="font-bold">Please complete your KYC to start selling.</p>
                    </div>
                );
        }
    };

    const FileInput = ({ name, label }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor={name} className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input id={name} name={name} type="file" className="sr-only" onChange={handleFileChange} disabled={!isEditable} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    {formData.documents[name] && <p className="text-xs text-green-600 font-semibold">{formData.documents[name].name}</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-72 overflow-x-hidden">
                <Header />
                <div className="p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My KYC</h1>
                        <p className="text-gray-600 mb-6">Verify your identity to access all platform features.</p>

                        {renderStatusBanner()}

                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
                            {/* Section 1: Vendor Details */}
                            <fieldset disabled={!isEditable} className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">1. Vendor Details</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                            <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">GST Number</label>
                                            <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Full Address</label>
                                            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Bank Details */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">2. Bank Details</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bank Account Name</label>
                                            <input type="text" name="accountName" value={formData.bankDetails.accountName} onChange={handleBankDetailsChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                                            <input type="text" name="accountNumber" value={formData.bankDetails.accountNumber} onChange={handleBankDetailsChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                                            <input type="text" name="ifsc" value={formData.bankDetails.ifsc} onChange={handleBankDetailsChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Document Upload */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">3. Document Upload</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4">
                                        <FileInput name="pan" label="PAN Card" />
                                        <FileInput name="gst" label="GST Certificate" />
                                        <FileInput name="cheque" label="Cancelled Cheque" />
                                        <FileInput name="registration" label="Company Registration (Optional)" />
                                    </div>
                                </div>
                            </fieldset>

                            {/* Submission Button */}
                            {isEditable && (
                                <div className="flex justify-end pt-6 border-t">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition font-semibold disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kyc;
