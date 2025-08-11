import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CrudServices } from "../../../../Api/CrudServices";
import { toast } from "sonner";

export const Stats = () => {
  const [stats, setStats] = useState({
    posts: 0,
    postsInReview: 0,
    postsRejected: 0,
    postsPublished: 0,
    framez: 0,
    framezInReview: 0,
    framezRejected: 0,
    framezPublished: 0,
    klipz: 0,
    klipzInReview: 0,
    klipzRejected: 0,
    klipzPublished: 0,
  });
  const [loading, setLoading] = useState(true);

  const crudServices = new CrudServices();

  const fetchAuthorDetails = async () => {
    try {
      const response = await crudServices.FetchDetails();
      if (response.error) {
        toast.error(response.error);
      } else {
        const { posts, framez, klipz } = response.data.author;

        const countStatus = (items, status) =>
          items.filter((item) => item.status === status).length;

        setStats({
          posts: posts.length,
          postsInReview: countStatus(posts, "inreview"),
          postsRejected: countStatus(posts, "rejected"),
          postsPublished: countStatus(posts, "published"),
          framez: framez.length,
          framezInReview: countStatus(framez, "inreview"),
          framezRejected: countStatus(framez, "rejected"),
          framezPublished: countStatus(framez, "published"),
          klipz: klipz.length,
          klipzInReview: countStatus(klipz, "inreview"),
          klipzRejected: countStatus(klipz, "rejected"),
          klipzPublished: countStatus(klipz, "published"),
        });
      }
    } catch (err) {
      toast.error("Error fetching Author details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorDetails();
  }, []);

  const formatTitle = (key) => {
    const formattedTitle = key.replace(/([A-Z])/g, " $1");
    return formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8">
        {Object.keys(stats).map((key) => (
          <StatsCard
            key={key}
            title={formatTitle(key)}
            count={stats[key] + 2}
            loading={loading}
            description={`${formatTitle(key)} count.`}
          />
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({ title, count, loading, description }) => (
  <Card
    x-chunk={`dashboard-05-chunk-${title.toLowerCase().replace(/ /g, "-")}`}
  >
    <CardHeader className="pb-2">
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-4xl">{loading ? "0" : count}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xs text-muted-foreground">{description}</div>
    </CardContent>
  </Card>
);

export default Stats;
