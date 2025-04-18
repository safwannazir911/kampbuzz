import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CrudServices } from '../../../../Api/CrudServices';
import { toast } from 'sonner';
import { EntityTabs } from './EntityTabs';
import { RecentTransactions } from './RecentTransactions';
import { Link } from 'react-router-dom';
import { CirclePlus } from 'lucide-react';


export const Stats = () => {
    const [studentsCount, setStudentsCount] = useState(0);
    const [postsCount, setPostsCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [authorsCount, setAuthorsCount] = useState(0);
    const [publisherssCount, setPublishersCount] = useState(0);



    const crudServices = new CrudServices();
    const fetchInstitutionDetails = async () => {
        try {
            const response = await crudServices.getInstitutionDetails();
            if (response.error) {
                toast.error(response.error);

            } else {
                setStudentsCount(response.data.institution.students.length);
                setPostsCount(response.data.institution.posts.length);
                setFollowersCount(response.data.institution.followers.length);
                setAuthorsCount(response.data.institution.institutionAuthor.length);
                setPublishersCount(response.data.institution.institutionPublisher.length);
            }
        } catch (err) {
            toast.error('Error fetching Institution details', err);
        }

    }


    useEffect(() => {
        fetchInstitutionDetails()
    }, [])

    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card
                    className="sm:col-span-1" x-chunk="dashboard-05-chunk-0"
                >
                    <CardHeader className="pb-3">
                        <CardTitle className="flex justify-between items-center">
                            Create authors and publishers.
                            <CirclePlus />
                        </CardTitle>
                        <CardDescription className="max-w-lg text-balance leading-relaxed">
                            Introducing Our Dynamic Admin Dashboard for Seamless Management and Insightful Analysis.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link to="/create">
                            <Button>Create New Author/Publisher</Button>
                        </Link>
                    </CardFooter>
                </Card>
                <Card x-chunk="dashboard-05-chunk-1">
                    <CardHeader className="pb-2">
                        <CardDescription>Authors</CardDescription>
                        <CardTitle className="text-4xl">{authorsCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">
                            Authors created till now.
                        </div>
                    </CardContent>

                </Card>
                <Card x-chunk="dashboard-05-chunk-2">
                    <CardHeader className="pb-2">
                        <CardDescription>Publishers</CardDescription>
                        <CardTitle className="text-4xl">{publisherssCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">
                            Publishers created till now.
                        </div>
                    </CardContent>

                </Card>
                <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="pb-2">
                        <CardDescription>Followers</CardDescription>
                        <CardTitle className="text-4xl">{followersCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">
                            Srudents follow your Institution.
                        </div>
                    </CardContent>

                </Card>
                <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="pb-2">
                        <CardDescription>Students</CardDescription>
                        <CardTitle className="text-4xl">{studentsCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">
                            Students are from your Institution.
                        </div>
                    </CardContent>

                </Card>

                <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="pb-2">
                        <CardDescription>Posts</CardDescription>
                        <CardTitle className="text-4xl">{postsCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground">
                            Posts published till now.
                        </div>
                    </CardContent>

                </Card>
            </div>

            <div className='flex mt-6 flex-col sm:flex-row'>

                <EntityTabs />

                <RecentTransactions />

            </div>


        </div>


    )
}
