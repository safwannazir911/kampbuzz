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
    postsPublished: 0,
    framez: 0,
    framezInReview: 0,
    framezPublished: 0,
    klipz: 0,
    klipzInReview: 0,
    klipzPublished: 0,
    authors: 0,
    requests: 0,
    published: 0,
  });
  const [loading, setLoading] = useState(true);

  const crudServices = new CrudServices();

  const fetchPublisherDetails = async () => {
    try {
      const response = await crudServices.FetchDetails();
      console.log(response);
      if (response.error) {
        toast.error(response.error);
      } else {
        const authors = response.data.publisher.institutionAuthors;
        setStats((prevStats) => ({
          ...prevStats,
          authors: authors.length,
        }));
        calculateCounts(authors);
      }
    } catch (err) {
      toast.error("Error fetching Author details", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCounts = (authors) => {
    let posts = 0,
      postsInReview = 0,
      postsPublished = 0,
      framez = 0,
      framezInReview = 0,
      framezPublished = 0,
      klipz = 0,
      klipzInReview = 0,
      klipzPublished = 0;

    authors.forEach((author) => {
      posts += author.posts.length;
      author.posts.forEach((post) => {
        if (post.status === "inreview") {
          postsInReview++;
        } else if (post.status === "published") {
          postsPublished++;
        }
      });

      framez += author.framez.length;
      author.framez.forEach((frame) => {
        if (frame.status === "inreview") {
          framezInReview++;
        } else if (frame.status === "published") {
          framezPublished++;
        }
      });

      klipz += author.klipz.length;
      author.klipz.forEach((klip) => {
        if (klip.status === "inreview") {
          klipzInReview++;
        } else if (klip.status === "published") {
          klipzPublished++;
        }
      });
    });

    setStats((prevStats) => ({
      ...prevStats,
      posts,
      postsInReview,
      postsPublished,
      framez,
      framezInReview,
      framezPublished,
      klipz,
      klipzInReview,
      klipzPublished,
      requests: postsInReview + framezInReview + klipzInReview,
      published: postsPublished + framezPublished + klipzPublished,
    }));
  };

  useEffect(() => {
    fetchPublisherDetails();
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
            count={stats[key]}
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
