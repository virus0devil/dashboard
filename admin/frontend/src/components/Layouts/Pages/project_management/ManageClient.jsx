import React, { useState, useEffect, useRef } from 'react'
import { useOnBoardClient } from "../../../../queries/project_management/onboard_clients/useOnBoardClient";
import { useClientAssignAssessments } from "../../../../queries/project_management/onboard_clients/AssignAssessment/useClientAssignAssessment";
import { useDebounce } from "../../../../hooks/useDebounce";
import { Search, X, EyeIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export const ManageClient = () => {
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientSearch, setClientSearch] = useState("");
    const [clientPage, setClientPage] = useState(1);
    const [clientPageSize, setClientPageSize] = useState(10);

    const navigate = useNavigate();

    const formRef = useRef(null);
    const debouncedClient = useDebounce(clientSearch, 300);

    const { data: clientResponse, isLoading, isFetching, } = useOnBoardClient({ search: debouncedClient, page: clientPage, limit: clientPageSize, });
    const onboardclient = clientResponse?.data ?? [];
    const hasMore = clientResponse?.hasMore ?? false;


    return (
        <div className='space-y-4 relative'>

            <SearchDetails
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Search Client"
            />

            <div className="border bg-white w-full rounded-2xl border-indigo-50 shadow-sm">
                <div className="border-b border-gray-200 h-20 rounded-t-2xl flex items-center justify-between px-6">
                    <div className="font-medium text-lg">
                        Manage Clients
                    </div>
                </div>
            </div>

            <div>
                <Layout
                    client={onboardclient}
                    onViewAssessment={(client) => {
                        setSelectedClient(client);
                    }}
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

            {selectedClient && (
                <ClientAssessmentModal
                    client={selectedClient}
                    onClose={() => setSelectedClient(null)}
                    navigate={navigate}
                    onAssessmentSelect={() => setSelectedClient(null)}
                />
            )}

        </div>
    )
}

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


const Layout = ({ client, onViewAssessment }) => {
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
                                                onClick={() => onViewAssessment(client)}
                                                className="group bg-gray-200 shadow relative cursor-pointer rounded p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                aria-label="View Client"
                                            >
                                                <EyeIcon className="h-5 w-5" />

                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white transition group-hover:scale-100">
                                                    View Assessment
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


const ClientAssessmentModal = ({client,onClose,navigate,onAssessmentSelect,}) => {
    const {data,isLoading,} = useClientAssignAssessments(client?.id);
    if (!client) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {client.company_name}
                        </h2>

                        <p className="text-sm text-gray-500">
                            Assigned Assessments
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-gray-500">
                                Loading assessments...
                            </p>
                        </div>
                    )}

                    {/* No assessments */}
                    {!isLoading &&
                        (!data || data.length === 0) && (
                            <div className="text-center py-8">
                                <p className="text-gray-400">
                                    No assessments assigned
                                </p>
                            </div>
                        )}

                    {/* Assessments */}
                    {!isLoading &&
                        data &&
                        data.length > 0 && (
                            <div className="flex flex-wrap gap-3">

                                {data.map((item) => (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => {
                                            navigate(
                                                "/manage-client/assets",
                                                {
                                                    state: {
                                                        client_id: client.id,
                                                        client_name:
                                                            client.company_name,
                                                        assessment_id:
                                                            item.assessment_type_id,
                                                        assessment_name:
                                                            item.assessment_name,
                                                    },
                                                }
                                            );

                                            onAssessmentSelect();
                                        }}
                                        className="px-4 py-2 rounded-lg hover:bg-indigo-100 cursor-pointer text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 transition"
                                    >
                                        {item.assessment_name ||
                                            `ID: ${item.assessment_type_id}`}
                                    </button>
                                ))}

                            </div>
                        )}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};