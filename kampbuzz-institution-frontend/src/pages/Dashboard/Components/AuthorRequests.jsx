import { useEffect, useState } from "react";
import { CrudServices } from "../../../../Api/CrudServices";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AuthorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const crudServices = new CrudServices();

    const fetchRequests = async () => {
        try {
            const response = await crudServices.getInstitutionAuthorRequests();
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.success("Author requests fetched Successfully!");
                setRequests(response.data.studentAuthors || []);
            }
        } catch (error) {
            console.error("Error fetching author requests:", error);
            toast.error("Failed to load author requests.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await crudServices.updateAuthorRequestStatus(id, status);
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.success("Status updated successfully.");
                fetchRequests();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status.");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (!requests.length) return <p className="text-center text-gray-500">No author requests found.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Author Requests</h1>
            <div className="space-y-4">
                {requests.map((req) => (
                    <div
                        key={req._id}
                        className="border rounded-xl p-4 shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage
                                    src={req.student?.avatar || ""}
                                    alt={req.student?.name || "Avatar"}
                                />
                                <AvatarFallback>
                                    {req.student?.name
                                        ?.split(" ")
                                        .map((word) => word[0])
                                        .join("") || "NA"}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-semibold">{req.student?.name}</p>
                                <p className="text-sm text-gray-600">{req.student?.email}</p>
                                <p
                                    className={`text-sm mt-1 ${req.status === "approved"
                                        ? "text-green-600"
                                        : req.status === "rejected"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    Status: {req.status}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {req.verificationDocument && (
                                <Dialog>
                                    <DialogTrigger
                                        onClick={() => setSelectedDoc(req.verificationDocument)}
                                        className="text-blue-500 underline text-sm"
                                    >
                                        View Document
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl w-full h-auto overflow-auto">
                                        <img
                                            src={selectedDoc}
                                            alt="Verification Document"
                                            className="w-full h-auto object-contain rounded"
                                        />
                                    </DialogContent>
                                </Dialog>
                            )}

                            {req.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => updateStatus(req._id, "approved")}
                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => updateStatus(req._id, "rejected")}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuthorRequests;
