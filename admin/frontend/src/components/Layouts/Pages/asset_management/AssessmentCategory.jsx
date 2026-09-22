import React, {
    useState,
    useMemo,
    forwardRef,
    useEffect,
    useRef,
    useImperativeHandle,
} from "react";
import { Plus, Search, X } from "lucide-react";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import { useDebounce } from "../../../../hooks/useDebounce";
import { useToast } from "../../../../hooks/useToast";

import { useAssessmentCategory } from "../../../../queries/asset_management/useAssessmentCategory";
import { useAddAssessmentCategory } from "../../../../queries/asset_management/useAddAssessmentCategory";
import { useUpdateAssessmentCategory } from "../../../../queries/asset_management/useUpdateAssessmentCategory";

export const AssessmentCategory = () => {
    const [addAssessment, setAddAssessment] = useState(false);
    const [mode, setMode] = useState("create");
    const [assessmentData, setAssessmentData] = useState(null);
    const [assessmentSearch, setAssessmentSearch] = useState("");

    const formRef = useRef(null);

    const {
        data: assessmentCategories = [],
        isLoading,
    } = useAssessmentCategory();

    const { showToast } = useToast();

    const addMutation = useAddAssessmentCategory();
    const updateMutation = useUpdateAssessmentCategory();

    const debouncedAssessment = useDebounce(assessmentSearch, 300);

    const filteredData = useMemo(() => {
        const searchValue = debouncedAssessment.toLowerCase();

        return assessmentCategories.filter((item) =>
            (item?.assessment_name ?? "")
                .toLowerCase()
                .includes(searchValue)
        );
    }, [assessmentCategories, debouncedAssessment]);

    const openModal = (modalMode, assessment = null) => {
        setMode(modalMode);
        setAssessmentData(assessment);
        setAddAssessment(true);
    };

    const closeModal = () => {
        setAddAssessment(false);
        setAssessmentData(null);
        setMode("create");
    };

    const handleView = (assessment) => {
        openModal("view", assessment);
    };

    const handleEdit = (assessment) => {
        openModal("edit", assessment);
    };

    const handleSubmit = async (data) => {
        try {
            if (mode === "create") {
                await addMutation.mutateAsync(data);

                showToast({
                    type: "success",
                    message: "Assessment added successfully",
                });
            }

            if (mode === "edit") {
                await updateMutation.mutateAsync({
                    assessmentId: assessmentData.id,
                    assessmentData: data,
                });

                showToast({
                    type: "success",
                    message: "Assessment updated successfully",
                });
            }

            closeModal();
        } catch (err) {
            console.error("Assessment operation failed:", err);

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
                value={assessmentSearch}
                onChange={(e) => setAssessmentSearch(e.target.value)}
                placeholder="Search Assessment"
            />

            <div className="border bg-white w-full rounded-2xl border-indigo-50 shadow-sm">
                <div className="border-b border-gray-200 h-20 rounded-t-2xl flex items-center justify-between px-6">

                    <div className="font-medium text-lg">
                        Assessment Types
                    </div>

                    <button
                        type="button"
                        onClick={() => openModal("create")}
                        className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Assessment</span>
                    </button>

                </div>
            </div>

            <div>
                <Layout
                    assessmentcategory={filteredData}
                    onView={handleView}
                    onEdit={handleEdit}
                />
            </div>

            {addAssessment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                    <div className="bg-white w-full max-w-md max-h-[85vh] rounded-2xl shadow-2xl flex flex-col">

                        <div className="flex bg-gray-50 rounded-t-2xl justify-between items-center px-6 py-4">

                            <h2 className="text-lg font-semibold text-gray-700">
                                {mode === "create" && "Add Assessment"}
                                {mode === "edit" && "Update Assessment"}
                                {mode === "view" && "View Assessment"}
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

                            <AssessmentForm
                                ref={formRef}
                                mode={mode}
                                initialData={assessmentData}
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

export const SearchDetails = ({
    value,
    onChange,
    placeholder,
}) => {
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

export const AssessmentForm = forwardRef(
    ({ mode, initialData, onSubmit }, ref) => {

        const [formData, setFormData] = useState({
            assessment_name: "",
        });

        useEffect(() => {
            if (initialData) {
                setFormData({
                    ...initialData,
                });
            } else {
                setFormData({
                    assessment_name: "",
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
                name="Assessment"
                onSubmit={(e) => e.preventDefault()}
                className="space-y-5"
            >

                <div>

                    <label
                        htmlFor="assessment_name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Assessment Name
                    </label>

                    <input
                        id="assessment_name"
                        name="assessment_name"
                        type="text"
                        value={formData.assessment_name}
                        onChange={handleChange}
                        placeholder="Enter Assessment Name"
                        disabled={isView}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />

                </div>

            </form>
        );
    }
);

export const Layout = ({
    assessmentcategory = [],
    onView,
    onEdit,
}) => {
    return (
        <div className="border bg-white w-full h-full rounded-2xl border-indigo-50 shadow-sm">

            <div className="mt-1.5 overflow-x-auto bg-white min-w-full border-b border-gray-300">

                <table className="min-w-full text-sm divide-y divide-gray-200">

                    <thead>
                        <tr>
                            <LayoutHeading heading="ID" />
                            <LayoutHeading heading="Assessment Types" />
                            <LayoutHeading heading="Actions" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                        {assessmentcategory.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No Assessment Found
                                </td>
                            </tr>

                        ) : (

                            assessmentcategory.map((assessment) => (

                                <tr
                                    key={assessment.id}
                                    className="hover:bg-slate-50 transition"
                                >

                                    <td className="p-3 text-sm text-center">
                                        {assessment.id}
                                    </td>

                                    <td className="p-3 text-sm text-center">
                                        {assessment.assessment_name}
                                    </td>

                                    <td className="p-3">

                                        <div className="flex justify-center items-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView?.(assessment)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="View Assessment"
                                            >
                                                <EyeIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    View Assessment
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit?.(assessment)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="Edit Assessment"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    Edit Assessment
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