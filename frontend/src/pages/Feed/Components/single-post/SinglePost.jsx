import { FeedService } from "@/API/FeedService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import isTouchDevice from "@/feature/isTouch";
import Post from "../Post";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { CrudServices } from "@/API/CrudServices";

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const feedService = new FeedService();
  const crudService = new CrudServices();

  const authUser = useAuthUser();

  const fetchPostsById = async (id) => {
    setLoading(true);
    await feedService
      .getPost(id)
      .then((response) => {
        setPost(response.data.post);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchStudentDetails = async () => {
    try {
      const student = await crudService.getStudentDetails();
      console.log(student);
      setBookmarks(student.data.studentData.bookmarks);
      setFollowing(student.data.studentData.following);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPostsById(id);
    fetchStudentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!post) {
    return <div>No post found</div>;
  }

  return (
    <div className="container mt-5 flex flex-col justify-center items-center">
      {/* <div className="flex items-center justify-center"> */}
      <Post
        key={post._id}
        post={post}
        isTouch={isTouchDevice()}
        studentId={authUser.id}
        bookmarked={bookmarks.includes(post._id)}
        following={following.includes(post.institutionAuthor.institution._id)}
      />
      {/* </div> */}
    </div>
  );
}
