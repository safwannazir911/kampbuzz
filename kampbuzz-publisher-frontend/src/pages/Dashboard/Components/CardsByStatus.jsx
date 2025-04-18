import React, { useEffect, useState } from "react";
import { CrudServices } from "../../../../Api/CrudServices";
import { toast } from "sonner";
import { Card } from "./Card";

export const CardsByStatus = ({ type, status }) => {
  const crudServices = new CrudServices();
  const [publishedItems, setPublishedItems] = useState([]);
  const [inReviewItems, setInReviewItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const sortItems = (data) => {
    const newPublishedItems = [];
    const newInReviewItems = [];

    // console.log(data);
    data.forEach((author) => {
      let items;
      if (type === "posts") {
        items = author.posts;
      } else if (type === "klipz") {
        items = author.klipz;
      } else if (type === "framez") {
        items = author.framez;
      }

      if (items && items.length > 0) {
        items.forEach((item) => {
          item.institutionAuthor = author.institutionAuthor;
          if (item.status === "published") {
            newPublishedItems.push(item);
          } else if (item.status === "inreview") {
            newInReviewItems.push(item);
          }
        });
      }
    });

    setPublishedItems(newPublishedItems);
    setInReviewItems(newInReviewItems);
  };

  const getItems = async () => {
    setLoading(true);
    try {
      const response = await crudServices.FetchDetails();
      if (response.error) {
        toast.error(response.error);
      } else {
        sortItems(response.data.publisher.institutionAuthors);
      }
    } catch (err) {
      toast.error("Error Fetching Items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, [type]);

  const renderItems = (items) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center mt-10 w-full h-full">
          <p className="text-lg text-gray-500">Loading Items...</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex justify-center items-center mt-10 w-full h-full">
          <p className="text-lg text-gray-500">No Items Available.</p>
        </div>
      );
    }

    return items.map((item, index) => {
      if (type === "posts") {
        return (
          <Card key={index} type="post" data={item} onRefresh={getItems} />
        );
      } else if (type === "klipz") {
        return (
          <Card key={index} type="klip" data={item} onRefresh={getItems} />
        );
      } else if (type === "framez") {
        return (
          <Card key={index} type="frame" data={item} onRefresh={getItems} />
        );
      }
      return null;
    });
  };

  return (
    <>
      {status === "all"
        ? renderItems([...publishedItems, ...inReviewItems])
        : status === "in-review"
        ? renderItems(inReviewItems)
        : status === "published"
        ? renderItems(publishedItems)
        : null}
    </>
  );
};
