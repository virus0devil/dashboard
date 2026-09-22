import React, {
    createContext,
    useCallback,
    useContext,
    useState
} from "react";

import Toast from "../components/Layouts/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(
        ({ type = "success", message, duration = 3000 }) => {

            const id = Date.now() + Math.random();

            setToasts((prev) => [
                ...prev,
                {
                    id,
                    type,
                    message
                }
            ]);

            // Auto remove toast
            setTimeout(() => {
                setToasts((prev) =>
                    prev.filter((toast) => toast.id !== id)
                );
            }, duration);
        },
        []
    );

    // Manually close toast
    const closeToast = useCallback((id) => {
        setToasts((prev) =>
            prev.filter((toast) => toast.id !== id)
        );
    }, []);

    return (
        <ToastContext.Provider
            value={{
                toasts,
                showToast,
                closeToast
            }}
        >
            {children}

            {/* Toast Container */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onClose={closeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToastContext = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToastContext must be used inside ToastProvider"
        );
    }

    return context;
};