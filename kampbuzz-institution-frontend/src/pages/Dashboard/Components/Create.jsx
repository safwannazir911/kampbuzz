import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import CommonCombinedInput from "@/components/common/CommonCombinedInput";
import { CrudServices } from "../../../../Api/CrudServices";
import { toast } from "sonner";
import { User } from 'lucide-react';
import { useState, useEffect } from "react";
import ReactSelect from "react-select";

const authorSchema = z.object({
    institutionAuthor: z.string().min(4, {
        message: "Name must have at least 4 characters."
    }).max(25, {
        message: "Name can have at most 25 characters."
    }).regex(/^[a-zA-Z ]+$/, {
        message: "Name should contain only alphabets."
    }),
    authorEmail: z.string().email().max(320, {
        message: "Email can have at most 320 characters."
    }),
    password: z.string().min(6, {
        message: "Password should have at least 6 characters.",
    }).max(25, {
        message: "Password can have at most 25 characters."
    }).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,25}$/, {
        message: "At least 1 lower, upper & special character",
    }),
    institutionPublisher: z.string().min(1)
});

const publisherSchema = z.object({
    name: z.string().min(4, {
        message: "Name must have at least 4 characters."
    }).max(25, {
        message: "Name can have at most 25 characters."
    }).regex(/^[a-zA-Z ]+$/, {
        message: "Name should contain only alphabets."
    }),
    email: z.string().email().max(320, {
        message: "Email can have at most 320 characters."
    }),
    password: z.string().min(6, {
        message: "Password should have at least 6 characters.",
    }).max(25, {
        message: "Password can have at most 25 characters."
    }).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,25}$/, {
        message: "At least 1 lower, upper & special character",
    }),
    phone: z.string().refine((value) => /^\d{10}$/.test(value), {
        message: "Phone number must be exactly 10 digits long and contain only digits",
    }),
    address: z.string().regex(/^[a-zA-Z0-9, ]+$/, {
        message: "Address should contain only letters, numbers, and commas."
    }).min(1, { message: "Address is required." })
});

const defaultAuthorValues = {
    institutionAuthor: "",
    authorEmail: "",
    password: "",
    institutionPublisher: ""
};

const defaultPublisherValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
};

const Create = () => {
    const [publishers, setPublishers] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const crudServices = new CrudServices();

    const authorForm = useForm({
        resolver: zodResolver(authorSchema),
        defaultValues: defaultAuthorValues,
    });

    const publisherForm = useForm({
        resolver: zodResolver(publisherSchema),
        defaultValues: defaultPublisherValues,
    });

    const onSubmitAuthor = async (data) => {
        try {
            const response = await crudServices.createAuthor(data);
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.success("Author created Successfully!");
                authorForm.reset();
                setFormSubmitted(!formSubmitted); // Toggle the state to re-render
            }
        } catch (err) {
            toast.error('Error creating author', err);
        }
    };

    const onSubmitPublisher = async (data) => {
        try {
            const response = await crudServices.createPublisher(data);
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.success("Publisher created Successfully!");
                publisherForm.reset();
                setFormSubmitted(!formSubmitted); // Toggle the state to re-render
            }
        } catch (err) {
            toast.error('Error creating publisher', err);
        }
    };

    const fetchInstitutionDetails = async () => {
        try {
            const response = await crudServices.getInstitutionDetails();
            if (response.error) {
                toast.error(response.error);
            } else {
                setPublishers(response.data.institution.institutionPublisher);
            }
        } catch (err) {
            toast.error('Error fetching Institution details', err);
        }
    };

    useEffect(() => {
        fetchInstitutionDetails();
    }, [formSubmitted]); // Re-fetch data when form is submitted

    return (
        <Tabs defaultValue="author" className="w-[400px]">
            <div className="flex items-center justify-between mb-3">
                <h2 className="pb-2 text-2xl font-semibold ">Create</h2>
                <User />
            </div>

            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="author">Author</TabsTrigger>
                <TabsTrigger value="publisher">Publisher</TabsTrigger>
            </TabsList>
            <TabsContent value="author">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Create Author</CardTitle>
                        <CardDescription>
                            Fill in the details to create a new author.
                        </CardDescription>
                    </CardHeader>
                    <Form {...authorForm}>
                        <form
                            onSubmit={authorForm.handleSubmit(onSubmitAuthor)}
                            className="w-full flex flex-col gap-4 p-4"
                        >
                            <FormField
                                control={authorForm.control}
                                name="institutionAuthor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <CommonCombinedInput
                                                {...field}
                                                placeholder="Enter your name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={authorForm.control}
                                name="institutionPublisher"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select your Publisher</FormLabel>
                                        <FormControl>
                                            <ReactSelect
                                                options={publishers.map(publisher => ({
                                                    value: publisher._id,
                                                    label: publisher.name,
                                                }))}
                                                onChange={(option) => field.onChange(option.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={authorForm.control}
                                name="authorEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <CommonCombinedInput
                                                {...field}
                                                placeholder="Enter your email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={authorForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <CommonCombinedInput
                                                {...field}
                                                type="password"
                                                placeholder="Enter your password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <CardFooter className="flex justify-end px-0">
                                <Button type="submit">Create Author</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
            <TabsContent value="publisher">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Create Publisher</CardTitle>
                        <CardDescription>
                            Fill in the details to create a new publisher.
                        </CardDescription>
                    </CardHeader>
                    <Form {...publisherForm}>
                        <form
                            onSubmit={publisherForm.handleSubmit(onSubmitPublisher)}
                            className="w-full flex flex-col gap-4 p-4"
                        >
                            <FormField
                                control={publisherForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <CommonCombinedInput
                                                {...field}
                                                placeholder="Enter the name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={publisherForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <CommonCombinedInput
                                                {...field}
                                                placeholder="Enter your email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={publisherForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <CommonCombinedInput
                                                {...field}
                                                type="password"
                                                placeholder="Enter your password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={publisherForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <CommonCombinedInput
                                                {...field}
                                                placeholder="Enter your phone number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={publisherForm.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <CommonCombinedInput
                                                {...field}
                                                placeholder="Enter your address"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <CardFooter className="flex justify-end px-0">
                                <Button type="submit">Create Publisher</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default Create;
