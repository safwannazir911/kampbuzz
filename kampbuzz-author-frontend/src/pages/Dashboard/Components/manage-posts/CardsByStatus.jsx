import React, { useEffect, useState } from "react";
import { CrudServices } from "../../../../../Api/CrudServices";
import { toast } from "sonner";
import { Card } from "./Card";

export const CardsByStatus = ({ type, status }) => {
  const crudServices = new CrudServices();
  const [loading, setLoading] = useState(false);

  const [publishedItems, setPublishedItems] = useState([]);
  const [inReviewItems, setInReviewItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [postAuthor, setPostAuthor] = useState("Unknown");

  const sortItemsByStatus = (items) => {
    const newPublishedItems = [];
    const newInReviewItems = [];
    const newRejectedItems = [];

    items.forEach((item) => {
      if (item.status === "published") {
        newPublishedItems.push(item);
      } else if (item.status === "inreview") {
        newInReviewItems.push(item);
      } else if (item.status === "rejected") {
        newRejectedItems.push(item);
      }
    });

    setPublishedItems(newPublishedItems);
    setInReviewItems(newInReviewItems);
    setRejectedItems(newRejectedItems);
  };

  const getItems = async () => {
    setLoading(true);
    try {
      const response = await crudServices.FetchDetails();
      // console.log("Card by Status", response.data.author);
      if (response.error) {
        toast.error(response.error);
      } else {
        const author = response.data.author;
        setPostAuthor(author.institutionAuthor);

        if (type === "posts") {
          sortItemsByStatus(author.posts);
        } else if (type === "klipz") {
          sortItemsByStatus(author.klipz);
        } else if (type === "framez") {
          sortItemsByStatus(author.framez);
        }
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

    return items.map((item, index) => (
      <Card
        key={index}
        type={type.slice(0, -1)}
        data={item}
        postAuthor={postAuthor}
        onRefresh={getItems}
      />
    ));
  };

  return (
    <>
      {status === "all"
        ? renderItems([...publishedItems, ...inReviewItems])
        : status === "in-review"
        ? renderItems(inReviewItems)
        : status === "published"
        ? renderItems(publishedItems)
        : status === "rejected"
        ? renderItems(rejectedItems)
        : null}
    </>
  );
};
