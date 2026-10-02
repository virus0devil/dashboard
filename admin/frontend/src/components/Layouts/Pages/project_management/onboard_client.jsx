import React, { useState, useMemo, forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { Plus, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { EyeIcon, PencilSquareIcon, Bars3Icon } from "@heroicons/react/24/outline";

import { useDebounce } from "../../../../hooks/useDebounce";
import { useToast } from "../../../../hooks/useToast";

import { useOnBoardClient } from "../../../../queries/project_management/onboard_clients/useOnBoardClient";
import { useAddOnBoardClient } from "../../../../queries/project_management/onboard_clients/useAddOnBoardClient";
import { useUpdateOnBoardClient } from "../../../../queries/project_management/onboard_clients/useUpdateOnBoardClient";
import { useClientAssignAssessments } from "../../../../queries/project_management/onboard_clients/AssignAssessment/useClientAssignAssessment";
import { useAssignAssessment } from "../../../../queries/project_management/onboard_clients/AssignAssessment/useAssignAssessment";
import { useAssessmentCategory } from "../../../../queries/asset_management/assessment_category/useAssessmentCategory";

import { useQueryClient } from "@tanstack/react-query";

export const OnBoardClient = () => {
    const [addClient, setAddClient] = useState(false);
    const [mode, setMode] = useState("create");
    const [clientData, setClientData] = useState(null);
    const [clientSearch, setClientSearch] = useState("");
    const [clientPage, setClientPage] = useState(1);
    const [clientPageSize, setClientPageSize] = useState(10);
    const { data: assessmentsData } = useAssessmentCategory();

    
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const assessments = useMemo(() => assessmentsData || [], [assessmentsData]);

    const formRef = useRef(null);
    const debouncedClient = useDebounce(clientSearch, 300);

    useEffect(() => {
        setClientPage(1);
    }, [debouncedClient]);

    const {data: clientResponse,isLoading,isFetching,} = useOnBoardClient({search: debouncedClient,page: clientPage,limit: clientPageSize,});
    const onboardclient = clientResponse?.data ?? [];
    const total = clientResponse?.total ?? 0;
    const hasMore = clientResponse?.hasMore ?? false;

    const { showToast } = useToast();

    const addMutation = useAddOnBoardClient();
    const updateMutation = useUpdateOnBoardClient();

    const openModal = (modalMode, client = null) => {
        setMode(modalMode);
        setClientData(client);
        setAddClient(true);
    };

    const closeModal = () => {
        setAddClient(false);
        setClientData(null);
        setMode("create");
    };

    const handleView = (client) => {
        openModal("view", client);
    };

    const handleEdit = (client) => {
        openModal("edit", client);
    };

    const handleSelectAssessment = (client) => {
        setSelectedClient(client);
        setOpenAssignModal(true);
    };

    const handleSubmit = async (data) => {
        try {
            if (mode === "create") {
                await addMutation.mutateAsync(data);

                showToast({
                    type: "success",
                    message: "Client OnBoard successfully",
                });
            }

            if (mode === "edit") {
                await updateMutation.mutateAsync({
                    id: clientData.id,
                    data: data,
                });

                showToast({
                    type: "success",
                    message: "Client OnBoard successfully",
                });
            }

            closeModal();
        } catch (err) {
            console.error("Onboard operation failed:", err);

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
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Search Client"
            />

            <div className="border bg-white w-full rounded-2xl border-indigo-50 shadow-sm">
                <div className="border-b border-gray-200 h-20 rounded-t-2xl flex items-center justify-between px-6">

                    <div className="font-medium text-lg">
                        Clients
                    </div>

                    <button
                        type="button"
                        onClick={() => openModal("create")}
                        className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>OnBoard Client</span>
                    </button>

                </div>
            </div>

            <div>
                <Layout
                    client={onboardclient}
                    onView={handleView}
                    onEdit={handleEdit}
                    onSelectAssessment={handleSelectAssessment}
                />
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">

                <div className="flex items-center gap-2 text-sm text-gray-600">

                    <span>Show</span>

                    <select
                        value={clientPageSize}
                        onChange={(e) => {
                            setClientPageSize(Number(e.target.value));
                            setClientPage(1);
                        }}
                        className="px-2 py-1 border cursor-pointer border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>

                    <span>entries per page</span>

                </div>


                <div className="flex items-center gap-3">

                    <span className="text-sm text-gray-600">
                        Page {clientPage}
                    </span>

                    <div className="flex items-center gap-1">

                        <button
                            type="button"
                            disabled={clientPage === 1 || isFetching}
                            onClick={() =>
                                setClientPage((prev) =>
                                    Math.max(prev - 1, 1)
                                )
                            }
                            className="p-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Previous Page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>


                        <button
                            type="button"
                            disabled={!hasMore || isFetching}
                            onClick={() =>
                                setClientPage((prev) => prev + 1)
                            }
                            className="p-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            aria-label="Next Page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                    </div>

                </div>

            </div>

            <AssignAssessmentForm
                open={openAssignModal}
                client={selectedClient}
                onClose={() => setOpenAssignModal(false)}
                assessments={assessments}
                AssignLoading={false}
            />

            {addClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md max-h-[85vh] rounded-2xl shadow-2xl flex flex-col">
                        <div className="flex bg-gray-50 rounded-t-2xl justify-between items-center px-6 py-4">

                            <h2 className="text-lg font-semibold text-gray-700">
                                {mode === "create" && "Add Client"}
                                {mode === "edit" && "Update Client"}
                                {mode === "view" && "View Client"}
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

                            <ClientForm
                                ref={formRef}
                                mode={mode}
                                initialData={clientData}
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

export const ClientForm = forwardRef(
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
                name="Client"
                onSubmit={(e) => e.preventDefault()}
                className="space-y-5"
            >

                <div>

                    <label
                        htmlFor="company_name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Client Name
                    </label>

                    <input
                        id="company_name"
                        name="company_name"
                        type="text"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Enter Client Name"
                        disabled={isView}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>

                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Company Address"
                        disabled={isView}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${isView
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "border-gray-300"
                            }`}
                    />
                </div>
            </form>
        );
    }
);

const Layout = ({ client = [], onView, onEdit, onSelectAssessment }) => {
    return (
        <div className="border bg-white w-full h-full rounded-2xl border-indigo-50 shadow-sm">

            <div className="mt-1.5 overflow-x-auto bg-white min-w-full border-b border-gray-300">

                <table className="min-w-full text-sm divide-y divide-gray-200">

                    <thead>
                        <tr>
                            <LayoutHeading heading="Client" />
                            <LayoutHeading heading="Actions" />
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                        {client.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No Client Found
                                </td>
                            </tr>

                        ) : (

                            client.map((client) => (

                                <tr
                                    key={client.id}
                                    className="hover:bg-slate-50 transition"
                                >
                                    <td className="p-3 text-sm text-center">
                                        {client.company_name}
                                    </td>

                                    <td className="p-3">

                                        <div className="flex justify-center items-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView?.(client)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="View Client"
                                            >
                                                <EyeIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    View client
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit?.(client)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="Edit Client"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    Edit Client
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onSelectAssessment?.(client)
                                                }
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="Select Assessment"
                                            >
                                                <Bars3Icon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    Select Assessment
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

const AssignAssessmentForm = ({client,open,onClose,assessments = [],AssignLoading = false}) => {
    const queryClient = useQueryClient();

    const {
        data: assignedData,
        isLoading: isAssignedLoading
    } = useClientAssignAssessments(client?.id);

    const [localSelected, setLocalSelected] = useState([]);

    const assignMutation = useAssignAssessment();

    useEffect(() => {
        if (!client?.id) {
            setLocalSelected([]);
            return;
        }

        if (Array.isArray(assignedData)) {
            setLocalSelected(
                assignedData.map(
                    (item) => String(item.assessment_Category_id)
                )
            );
        }
    }, [client?.id, assignedData]);


    const toggleAssessment = (id) => {

        const idStr = String(id);

        setLocalSelected((prev) => {

            if (prev.includes(idStr)) {
                return prev.filter(
                    (item) => item !== idStr
                );
            }

            return [...prev, idStr];
        });
    };


    const handleAssign = async () => {
        try {
            await assignMutation.mutateAsync({
                client_id: client.id,
                assessment_ids: localSelected.map(Number),
            });

            await queryClient.invalidateQueries({
                queryKey: ["clientAssessments", client.id],
            });

            await queryClient.invalidateQueries({
                queryKey: ["onboardclient"],
            });

            onClose();
        } catch (err) {
            console.error("Error assigning assessments:", err);
        }
    };


    if (!open) {
        return null;
    }

    const isLoadingState =
        AssignLoading || isAssignedLoading;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-white w-[95%] sm:w-[90%] md:w-[80%] lg:max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                <div className="flex items-center justify-between bg-gray-50 px-6 py-4">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Assign Assessments

                        {client?.company_name && (
                            <span className="text-sm text-gray-500 ml-2">
                                ({client.company_name})
                            </span>
                        )}
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl cursor-pointer hover:bg-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>

                </div>


                <div className="flex-1 overflow-y-auto p-6">

                    {isLoadingState ? (

                        <div className="text-center py-10 text-gray-500">
                            Loading assessments...
                        </div>

                    ) : assessments.length === 0 ? (

                        <div className="text-center py-10 text-gray-500">
                            No assessments available.
                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {assessments.map((item) => {
                                return (
                                    <label
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-200"
                                    >

                                        <input
                                            type="checkbox"
                                            checked={localSelected.includes(String(item.id))}
                                            onChange={() => toggleAssessment(item.id)}
                                            className="w-4 h-4"
                                        />

                                        <span className="text-sm font-medium text-gray-700">
                                            {item.assessment_name}
                                        </span>

                                    </label>
                                );
                            })}

                        </div>
                    )}

                </div>


                <div className="flex justify-end items-center gap-3 bg-gray-50 px-6 py-4">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleAssign}
                        disabled={assignMutation.isPending}
                        className="px-6 py-2 bg-indigo-600 cursor-pointer hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg"
                    >
                        {assignMutation.isPending
                            ? "Saving..."
                            : "Assign"}
                    </button>

                </div>

            </div>

        </div>
    );
};