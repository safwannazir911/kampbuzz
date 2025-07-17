import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CrudServices } from "@/API/CrudServices";
import { toast } from "sonner";



export default function RegisterAuthor() {
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const crudServices = new CrudServices();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file); // your backend should expect this field

        try {
            setIsSubmitting(true);

            console.log("Submitting form data:", formData);
            const response = await crudServices.registerAuthor(formData);
            if (response.data) {
                toast.success("Request submitted successfully. Please wait for verification.");
                setFile(null);
            }

        } catch (error) {
            toast.error("Error submitting request. Please try again.");
            console.error("Error submitting request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Register as an Author</CardTitle>
                    <CardDescription>
                        Upload a verification document to register as an author.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid w-full max-w-sm items-center gap-2">
                                <Label htmlFor="document">Verification Document</Label>
                                <Input
                                    id="document"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <CardFooter className="flex-col gap-2 px-0 mt-6">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Request Verification"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
