import React, {useState,useMemo,forwardRef,useEffect,useRef,useImperativeHandle} from "react";
import { Plus, Search, X } from "lucide-react";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import { useDebounce } from "../../../../hooks/useDebounce";
import { useToast } from "../../../../hooks/useToast";

import { usecomplianceCategory } from "../../../../queries/asset_management/compliance_category/useComplianceCategory";
import { useAddComplianceCategory } from "../../../../queries/asset_management/compliance_category/useAddComplianceCategory";
import { useUpdateComplianceCategory } from "../../../../queries/asset_management/compliance_category/useUpdateComplianceCategory";

export const ComplianceCategory = () => {
    const [addCompliance, setAddCompliance] = useState(false);
    const [mode, setMode] = useState("create");
    const [complianceData, setComplianceData] = useState(null);
    const [complianceSearch, setComplianceSearch] = useState("");

    const formRef = useRef(null);

    const {data: complianceCategories = [],isLoading} = usecomplianceCategory();

    const { showToast } = useToast();

    const addMutation = useAddComplianceCategory();
    const updateMutation = useUpdateComplianceCategory();

    const debouncedCompliance = useDebounce(complianceSearch, 300);

    const filteredData = useMemo(() => {
        const searchValue = debouncedCompliance.toLowerCase(); 

        return complianceCategories.filter((item) =>
            (item?.compliance_name ?? "")
                .toLowerCase()
                .includes(searchValue)
        );
    }, [complianceCategories, debouncedCompliance]);

    const openModal = (modalMode, compliance = null) => {
        setMode(modalMode);
        setComplianceData(compliance);
        setAddCompliance(true);
    };

    const closeModal = () => {
        setAddCompliance(false);
        setComplianceData(null);
        setMode("create");
    };

    const handleView = (compliance) => {
        openModal("view", compliance);
    };

    const handleEdit = (compliance) => {
        openModal("edit", compliance);
    };

    const handleSubmit = async (data) => {
        try {
            if (mode === "create") {
                await addMutation.mutateAsync(data);

                showToast({
                    type: "success",
                    message: "Compliance added successfully",
                });
            }

            if (mode === "edit") {
                await updateMutation.mutateAsync({
                    complianceId: complianceData.id,
                    complianceData: data,
                });

                showToast({
                    type: "success",
                    message: "Compliance updated successfully",
                });
            }

            closeModal();
        } catch (err) {
            console.error("Compliance operation failed:", err);

            showToast({
                type: "error",
                message: "Something went wrong",
            });
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-4 relative">

            <SearchDetails
                value={complianceSearch}
                onChange={(e) => setComplianceSearch(e.target.value)}
                placeholder="Search Compliance"
            />

            <div className="border bg-white w-full rounded-2xl border-indigo-50 shadow-sm">
                <div className="border-b border-gray-200 h-20 rounded-t-2xl flex items-center justify-between px-6">

                    <div className="font-medium text-lg">
                        Compliance Types
                    </div>

                    <button
                        type="button"
                        onClick={() => openModal("create")}
                        className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Compliance</span>
                    </button>

                </div>
            </div>

            <div>
                <Layout
                    compliancecategory={filteredData}
                    onView={handleView}
                    onEdit={handleEdit}
                />
            </div>

            {addCompliance && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                    <div className="bg-white w-full max-w-md max-h-[85vh] rounded-2xl shadow-2xl flex flex-col">

                        <div className="flex bg-gray-50 rounded-t-2xl justify-between items-center px-6 py-4">

                            <h2 className="text-lg font-semibold text-gray-700">
                                {mode === "create" && "Add Compliance"}
                                {mode === "edit" && "Update Compliance"}
                                {mode === "view" && "View Compliance"}
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-2 cursor-pointer rounded-lg hover:bg-indigo-50"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>

                        </div>

                        <div className="p-6 overflow-y-auto flex-1">

                            <ComplianceForm
                                ref={formRef}
                                mode={mode}
                                initialData={complianceData}
                                onSubmit={handleSubmit}
                            />

                        </div>

                        {mode !== "view" && (
                            <div className="flex bg-gray-50 justify-end gap-3 px-6 py-4 rounded-b-2xl">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        formRef.current?.submitForm?.()
                                    }
                                    className="px-5 py-2 rounded-lg bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700"
                                >
                                    Submit
                                </button>

                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};

export const SearchDetails = ({value,onChange,placeholder}) => {
    return (
        <div className="flex gap-4">

            <div className="w-full max-w-sm min-w-[200px]">

                <div className="relative flex items-center">

                    <Search className="absolute w-5 h-5 left-2.5 text-slate-600" />

                    <input
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                    />

                </div>

            </div>

        </div>
    );
};

export const ComplianceForm = forwardRef(
    ({ mode, initialData, onSubmit }, ref) => {

        const [formData, setFormData] = useState({
            compliance_name: "",
        });

        useEffect(() => {
            if (initialData) {
                setFormData({
                    ...initialData,
                });
            } else {
                setFormData({
                    compliance_name: "",
                });
            }
        }, [initialData]);

        const handleChange = (e) => {
            const { name, value } = e.target;

            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        useImperativeHandle(
            ref,
            () => ({
                submitForm() {
                    onSubmit(formData);
                },
            }),
            [formData, onSubmit]
        );

        const isView = mode === "view";

        return (
            <form
                name="Compliance"
                onSubmit={(e) => e.preventDefault()}
                className="space-y-5"
            >

                <div>

                    <label
                        htmlFor="compliance_name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Compliance Name
                    </label>

                    <input
                        id="compliance_name"
                        name="compliance_name"
                        type="text"
                        value={formData.compliance_name}
                        onChange={handleChange}
                        placeholder="Enter Compliance Name"
                        disabled={isView}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />

                </div>

            </form>
        );
    }
);

export const Layout = ({compliancecategory = [],onView,onEdit}) => {
    return (
        <div className="border bg-white w-full h-full rounded-2xl border-indigo-50 shadow-sm">

            <div className="mt-1.5 overflow-x-auto bg-white min-w-full border-b border-gray-300">

                <table className="min-w-full text-sm divide-y divide-gray-200">

                    <thead>
                        <tr>
                            <LayoutHeading heading="ID" />
                            <LayoutHeading heading="Compliance Types" />
                            <LayoutHeading heading="Actions" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                        {compliancecategory.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No Compliance Found
                                </td>
                            </tr>

                        ) : (

                            compliancecategory.map((compliance) => (

                                <tr
                                    key={compliance.id}
                                    className="hover:bg-slate-50 transition"
                                >

                                    <td className="p-3 text-sm text-center">
                                        {compliance.id}
                                    </td>

                                    <td className="p-3 text-sm text-center">
                                        {compliance.compliance_name}
                                    </td>

                                    <td className="p-3">

                                        <div className="flex justify-center items-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView?.(compliance)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="View Compliance"
                                            >
                                                <EyeIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    View Compliance
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit?.(compliance)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="Edit Compliance"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    Edit Compliance
                                                </span>
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export const LayoutHeading = ({ heading }) => {
    return (
        <th className="p-3 text-center text-xs font-bold text-gray-600 uppercase">
            {heading}
        </th>
    );
};