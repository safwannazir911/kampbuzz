import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PostCards from "./PostCards";
import { FeedService } from "@/API/FeedService";

const ExploreViewCard = () => {
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const feedService = new FeedService();

  const fetchPostsById = async (id) => {
    setLoading(true);
    await feedService
      .getPost(id)
      .then((response) => {
        console.log(response.data);
        setPost(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPostsById(id);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-3">
      {/* Your component content using the id */}
      <PostCards posts={post} />
    </div>
  );
};

export default ExploreViewCard;
