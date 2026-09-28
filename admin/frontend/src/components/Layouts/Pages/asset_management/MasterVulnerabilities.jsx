import React, { useState, useMemo, forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { Plus, Search, X, Upload } from "lucide-react";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import { useDebounce } from "../../../../hooks/useDebounce";
import { useToast } from "../../../../hooks/useToast";

import { useMasterVulnerabilities } from "../../../../queries/asset_management/master_vulnerabilities/useMasterVulnerabilities";
import { useAddMasterVulnerabilities } from "../../../../queries/asset_management/master_vulnerabilities/useAddMasterVulnerabilities";
import { useUpdateMasterVulnerabilities } from "../../../../queries/asset_management/master_vulnerabilities/useUpdateMasterVulnerabilities";
import { useAssessmentCategory } from "../../../../queries/asset_management/assessment_category/useAssessmentCategory";

import Cvss from "cvss-calculator";

export const MasterVulnerabilities = () => {
    const [addMasterVulnerabilities, setAddMasterVulnerabilities] = useState(false);
    const [mode, setMode] = useState("create");
    const [mastervulnerabilitiesData, setmastervulnerabilitiesData] = useState(null);
    const { data: assessmentTypes = [] } = useAssessmentCategory();
    

    const [vidSearch, setVidSearch] = useState("");
    const [masterVulnerabilitiesSearch, setMasterVulnerabilitiesSearch] = useState("");
    const [categorySearch, setCategorySearch] = useState("");
    const [severitySearch, setSeveritySearch] = useState("");
    const [cwe_idSearch, setCweIdSearch] = useState("");
    const [gradeSearch, setGradeSearch] = useState("");

    const formRef = useRef(null);

    const { data: MasterVulnerabilities = [], isLoading } = useMasterVulnerabilities();
    
    const { showToast } = useToast();

    const addMutation = useAddMasterVulnerabilities();
    const updateMutation = useUpdateMasterVulnerabilities();

    const debouncedvulnerabilities = useDebounce(masterVulnerabilitiesSearch, 300);

    const filteredData = useMemo(() => {
        const vid = vidSearch.toLowerCase().trim();
        const vuln = masterVulnerabilitiesSearch.toLowerCase().trim();
        const category = categorySearch.toLowerCase().trim();
        const severity = severitySearch.toLowerCase().trim();

        return MasterVulnerabilities.filter((item) => {
            const categoryObj = assessmentTypes.find(
                (cat) => String(cat.id) === String(item.category)
            );

            const categoryName = String(
                categoryObj?.assessment_name ?? ""
            )
                .toLowerCase()
                .trim();

            const categoryId = String(item?.category ?? "")
                .toLowerCase()
                .trim();

            const vidMatch =
                !vid ||
                String(item?.vid ?? "")
                    .toLowerCase()
                    .includes(vid);

            const vulnMatch =
                !vuln ||
                String(item?.vulnerability_name ?? "")
                    .toLowerCase()
                    .includes(vuln);

            const categoryMatch =
                !category ||
                categoryId.includes(category) ||
                categoryName.includes(category);

            const severityMatch =
                !severity ||
                String(item?.severity ?? "")
                    .toLowerCase()
                    .includes(severity);

            return (
                vidMatch &&
                vulnMatch &&
                categoryMatch &&
                severityMatch
            );
        });
    }, [
        MasterVulnerabilities,
        assessmentTypes,
        vidSearch,
        masterVulnerabilitiesSearch,
        categorySearch,
        severitySearch,
    ]);

    const openModal = (modalMode, vulnerabilities = null) => {
        setMode(modalMode);
        setmastervulnerabilitiesData(vulnerabilities);
        setAddMasterVulnerabilities(true);
    };

    const closeModal = () => {
        setAddMasterVulnerabilities(false);
        setmastervulnerabilitiesData(null);
        setMode("create");
    };

    const handleView = (vulnerabilities) => {
        openModal("view", vulnerabilities);
    };

    const handleEdit = (vulnerability) => {
        openModal("edit", vulnerability);
    };

    const handleSubmit = async (vulnerabilities) => {
        try {
            if (mode === "create") {
                await addMutation.mutateAsync(vulnerabilities);

                showToast({
                    type: "success",
                    message: "Vulnerability added successfully",
                });
            }

            if (mode === "edit") {
                await updateMutation.mutateAsync({
                    vulnvid:vulnerabilities.vid,
                    vulnData: vulnerabilities
                });

                showToast({
                    type: "success",
                    message: "Vulnerability updated successfully",
                });
            }

            closeModal();

        } catch (err) {
            console.error("Vulnerability operation failed:", err);

            showToast({
                type: "error",
                message:
                    err?.response?.data?.detail ||
                    err?.message ||
                    "Something went wrong",
            });
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-4 relative">

            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                <SearchDetails
                    value={vidSearch}
                    onChange={(e) => setVidSearch(e.target.value)}
                    placeholder="Search VID"
                />

                <SearchDetails
                    value={masterVulnerabilitiesSearch}
                    onChange={(e) => setMasterVulnerabilitiesSearch(e.target.value)}
                    placeholder="Search Vulnerability"
                />

                <SearchDetails
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search Category"
                />

                <SearchDetails
                    value={severitySearch}
                    onChange={(e) => setSeveritySearch(e.target.value)}
                    placeholder="Search Severity"
                />
            </div>

            <div className="border bg-white w-full rounded-2xl border-indigo-50 shadow-sm">
                <div className="border-b border-gray-200 h-20 rounded-t-2xl flex items-center justify-between px-6">

                    <div className="font-medium text-lg">
                        Vulnerability Checklist
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => openModal("create")}
                            className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                            aria-label="Add vulnerability"
                        >
                            <Plus className="w-4 h-4" aria-hidden="true" />
                            <span>Add Vulnerability</span>
                        </button>

                        <button
                            type="button"
                            // onClick={() => openModal(MODAL_MODES.UPLOAD)}
                            className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                            aria-label="Upload vulnerability Excel file"
                        >
                            <Upload className="w-4 h-4" aria-hidden="true" />
                            <span>Upload excel</span>
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <Layout
                    mastervulnerability={filteredData}
                    onView={handleView}
                    onEdit={handleEdit}
                />
            </div>

            {addMasterVulnerabilities && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                    <div className="bg-white w-full max-w-md max-h-[85vh] rounded-2xl shadow-2xl flex flex-col">

                        <div className="flex bg-gray-50 rounded-t-2xl justify-between items-center px-6 py-4">

                            <h2 className="text-lg font-semibold text-gray-700">
                                {mode === "create" && "Add Vulnerability"}
                                {mode === "edit" && "Update Vulnerability"}
                                {mode === "view" && "View Vulnerability"}
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

                            <VulnerabilityForm
                                ref={formRef}
                                mode={mode}
                                initialData={mastervulnerabilitiesData}
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

const SearchDetails = ({ value, onChange, placeholder }) => {
    return (
        <div className="w-full">
            <div className="relative group">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-500" strokeWidth={2}
                    />

                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() =>
                            onChange({
                                target: {
                                    value: "",
                                },
                            })
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        aria-label={`Clear ${placeholder}`}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
};

const InputField = ({label,name,value,onChange,colSpan,placeholder,disabled = false}) => (
    <div className={colSpan ? "md:col-span-2" : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>

        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                disabled
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "border-gray-300"
            }`}
        />
    </div>
);

const TextAreaField = ({label,name,value,onChange,placeholder,disabled = false}) => (
    <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>

        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="3"
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                disabled
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "border-gray-300"
            }`}
        />
    </div>
);

const initialState = {
    vulnerability_name: "",
    cvss_score: "",
    category:"",
    severity: "",
    cvss_vector: "",
    cwe_id: "",
    description: "",
    remediation: "",
    impact: "",
    reference: ""
};

const VulnerabilityForm = forwardRef(
    ({ mode, initialData, onSubmit }, ref) => {
        const { data: assessmentTypes = [], isLoading } = useAssessmentCategory();
        const [formData, setFormData] = useState(initialState);
        const [cvssModal, setCvssModal] = useState(false);

        useEffect(() => {
            if (initialData) {
                setFormData({
                    ...initialState,
                    ...initialData,
                });
            } else {
                setFormData(initialState);
            }
        }, [initialData]);

        const handleChange = (e) => {
            const { name, value } = e.target;

            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        const calculateCVSS = (vector, score, severity) => {
            setFormData((prev) => ({
                ...prev,
                cvss_vector: vector,
                cvss_score: score,
                severity: severity,
            }));

            setCvssModal(false);
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
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200">
                <form
                    name="Vulnerability"
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-5"
                >
                    {/* Vulnerability Name */}
                    <div>
                        <label
                            htmlFor="vulnerability_name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Vulnerability Name
                        </label>

                        <input
                            id="vulnerability_name"
                            name="vulnerability_name"
                            type="text"
                            value={formData.vulnerability_name}
                            onChange={handleChange}
                            placeholder="Enter Vulnerability Name"
                            disabled={isView}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>

                    {/* CVSS Score / Severity / Calculator */}
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                        <InputField
                            label="CVSS Score"
                            name="cvss_score"
                            value={formData.cvss_score}
                            onChange={handleChange}
                            disabled={isView}
                            placeholder="CVSS Score"
                        />

                        <InputField
                            label="Severity"
                            name="severity"
                            value={formData.severity}
                            onChange={handleChange}
                            disabled={isView}
                            placeholder="Severity"
                        />

                        <button
                            type="button"
                            onClick={() => setCvssModal(true)}
                            disabled={isView}
                            title="Calculate CVSS"
                            aria-label="Calculate CVSS"
                            className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
                                isView
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white cursor-pointer hover:shadow-md"
                            }`}
                        >
                            <Plus
                                className="w-5 h-5 stroke-[2.5]"
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    {/* CVSS Vector */}
                    <InputField
                        label="CVSS Vector"
                        name="cvss_vector"
                        value={formData.cvss_vector}
                        onChange={handleChange}
                        disabled={isView}
                        placeholder="CVSS Vector"
                    />

                    {/* Category */}
                    <div className="input-group">
                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={isLoading || isView}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
                        >
                            <option value="">
                                {isLoading ? "Loading..." : "Category"}
                            </option>

                            {assessmentTypes.map((type) => (
                                <option
                                    key={type.id}
                                    value={type.id}
                                >
                                    {type.assessment_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* CWE ID */}
                    <InputField
                        label="CWE ID"
                        name="cwe_id"
                        value={formData.cwe_id}
                        onChange={handleChange}
                        disabled={isView}
                        placeholder="CWE ID"
                    />

                    {/* Description */}
                    <TextAreaField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={isView}
                        placeholder="Description"
                    />

                    {/* Impact */}
                    <TextAreaField
                        label="Impact"
                        name="impact"
                        value={formData.impact}
                        onChange={handleChange}
                        disabled={isView}
                        placeholder="Impact"
                    />

                    {/* Remediation */}
                    <TextAreaField
                        label="Remediation"
                        name="remediation"
                        value={formData.remediation}
                        onChange={handleChange}
                        disabled={isView}
                        placeholder="Remediation"
                    />

                    {/* Reference */}
                    <InputField
                        label="Reference"
                        name="reference"
                        value={formData.reference}
                        onChange={handleChange}
                        disabled={isView}
                        placeholder="Reference"
                    />
                </form>

                {cvssModal && (
                    <CVSSModal
                        onClose={() => setCvssModal(false)}
                        onCalculate={calculateCVSS}
                    />
                )}
            </div>
        );
    }
);

const CVSSModal = ({ onClose, onCalculate }) => {
    const [metrics, setMetrics] = useState({
        AV: "",
        AC: "",
        PR: "",
        UI: "",
        S: "",
        C: "",
        I: "",
        A: ""
    });

    const metricsConfig = [
        {
            title: "Attack Vector",
            key: "AV",
            options: [
                ["Network", "N"],
                ["Adjacent", "A"],
                ["Local", "L"],
                ["Physical", "P"]
            ]
        },
        {
            title: "Attack Complexity",
            key: "AC",
            options: [
                ["Low", "L"],
                ["High", "H"]
            ]
        },
        {
            title: "Privileges Required",
            key: "PR",
            options: [
                ["None", "N"],
                ["Low", "L"],
                ["High", "H"]
            ]
        },
        {
            title: "User Interaction",
            key: "UI",
            options: [
                ["None", "N"],
                ["Required", "R"]
            ]
        },
        {
            title: "Scope",
            key: "S",
            options: [
                ["Changed", "C"],
                ["Unchanged", "U"]
            ]
        },
        {
            title: "Confidentiality",
            key: "C",
            options: [
                ["High", "H"],
                ["Low", "L"],
                ["None", "N"]
            ]
        },
        {
            title: "Integrity",
            key: "I",
            options: [
                ["High", "H"],
                ["Low", "L"],
                ["None", "N"]
            ]
        },
        {
            title: "Availability",
            key: "A",
            options: [
                ["High", "H"],
                ["Low", "L"],
                ["None", "N"]
            ]
        }
    ];

    const calculate = () => {
        const requiredMetrics = [
            "AV",
            "AC",
            "PR",
            "UI",
            "S",
            "C",
            "I",
            "A"
        ];

        const missingMetric = requiredMetrics.find(
            (metric) => !metrics[metric]
        );

        if (missingMetric) {
            alert(`Please select ${missingMetric} before calculating.`);
            return;
        }

        const vector =
            `CVSS:3.1/AV:${metrics.AV}/AC:${metrics.AC}` +
            `/PR:${metrics.PR}/UI:${metrics.UI}/S:${metrics.S}` +
            `/C:${metrics.C}/I:${metrics.I}/A:${metrics.A}`;

        try {
            const cvss = new Cvss(vector);

            const score = cvss.getBaseScore();
            const severity = cvss.getRating();

            onCalculate(vector, score, severity);
        } catch (error) {
            console.error("CVSS calculation error:", error);
            alert("Invalid CVSS vector. Please check the selected metrics.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-[800px] mx-4">
                <h3 className="font-semibold text-lg mb-4">
                    CVSS v3.1 Calculator
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metricsConfig.map((metric) => (
                        <div
                            key={metric.key}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                {metric.title}
                            </h4>

                            <div className="flex flex-col gap-2">
                                {metric.options.map(([label, value]) => {
                                    const selected =
                                        metrics[metric.key] === value;

                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            aria-pressed={selected}
                                            className={`w-full text-sm font-medium rounded-md px-3 py-2 border transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500
                                                ${
                                                    selected
                                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                                }`}
                                            onClick={() =>
                                                setMetrics((prev) => ({
                                                    ...prev,
                                                    [metric.key]: value
                                                }))
                                            }
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 cursor-pointer hover:bg-gray-200 rounded-lg py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={calculate}
                        className="px-4 py-2 rounded-lg cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        Calculate
                    </button>
                </div>
            </div>
        </div>
    );
};

const Layout = ({ mastervulnerability = [], onView, onEdit }) => {
    const { data: assessmentTypes = [] } = useAssessmentCategory();

    const getAssessmentName = (categoryId) => {
        const assessment = assessmentTypes.find(
            (type) => String(type.id) === String(categoryId)
        );

        return assessment?.assessment_name || "-";
    };

    return (
        <div className="border bg-white w-full h-full rounded-2xl border-indigo-50 shadow-sm">

            <div className="mt-1.5 overflow-x-auto bg-white min-w-full border-b border-gray-300">

                <table className="min-w-full text-sm divide-y divide-gray-200">

                    <thead>
                        <tr>
                            <LayoutHeading heading="VID" />
                            <LayoutHeading heading="Vulnerability Name" />
                            <LayoutHeading heading="Category" />
                            <LayoutHeading heading="Severity" />
                            <LayoutHeading heading="Actions" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                        {mastervulnerability.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No Vulnerability Found
                                </td>
                            </tr>

                        ) : (

                            mastervulnerability.map((vulnerability) => (

                                <tr
                                    key={vulnerability.vid}
                                    className="hover:bg-slate-50 transition"
                                >

                                    <td className="p-3 text-sm text-center">
                                        {vulnerability.vid}
                                    </td>

                                    <td className="p-3 text-sm text-center">
                                        {vulnerability.vulnerability_name}
                                    </td>

                                    <td className="p-3 text-sm text-center">
                                        {getAssessmentName(vulnerability.category)}
                                    </td>

                                    <td className="p-3 text-sm text-center">
                                        {vulnerability.severity}
                                    </td>

                                    <td className="p-3">

                                        <div className="flex justify-center items-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView?.(vulnerability)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="View Vulnerability"
                                            >
                                                <EyeIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    View Vulnerability
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit?.(vulnerability)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="Edit Vulnerability"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    Edit Vulnerability
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

const LayoutHeading = ({ heading }) => {
    return (
        <th className="p-3 text-center text-xs font-bold text-gray-600 uppercase">
            {heading}
        </th>
    );
};