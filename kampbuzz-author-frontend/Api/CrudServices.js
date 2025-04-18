import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import url from "../feature/url";

export class CrudServices {
  token = useAuthHeader();
  link = url();
  constructor() {
    this.backendUrl = `${this.link}/author`;
  }

  async handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data };
    } else {
      // console.error(`Error: ${response.status} - ${response.statusText}`);
      return { error: response.data?.message || "Request failed" };
    }
  }

  async fetchJson(url, options) {
    try {
      const response = await axios(url, options);
      return this.handleResponse(response);
    } catch (error) {
      console.error("Fetch error:", error);
      if (axios.isAxiosError(error) && error.response) {
        return { error: error.response.data?.message || "Network error" };
      }
      return { error: "Network error" };
    }
  }

  async loginUser(data) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    };

    return this.fetchJson(`${this.backendUrl}/login`, options);
  }

  //   @Tabeed-H
  // Added API call to fetch post based on status

  async GetPosts(status) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this.token,
      },
    };

    return this.fetchJson(``);
  }

  // @Tabeed-H
  // Added API to fetch posts on dashboard
  // might change
  async FetchDetails() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: this.token,
      },
    };

    return this.fetchJson(`${this.backendUrl}/dashboard`, options);
  }

  // @Tabeed-H
  // Added API call for Creating Post
  async CreatePost(FormData) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this.token,
      },
      data: FormData,
    };

    return this.fetchJson(`${this.backendUrl}/publish-post`, options);
  }

  //   @Tabeed-H
  // Added API call for Deleting Post
  async DeletePost(id) {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this.token,
      },
    };
    return this.fetchJson(`${this.backendUrl}/delete-post/${id}`, options);
  }

  //   @Tabeed-H
  // Added API call for Updating Post
  async UpdatePost(id, UpdatedFields) {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this.token,
      },
      data: UpdatedFields,
    };
    return this.fetchJson(`${this.backendUrl}/update-post/${id}`, options);
  }

  async publishKlipz(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this.token,
      },
      data: data,
    };

    return this.fetchJson(`${this.backendUrl}/publish-klipz`, options);
  }

  async publishFramez(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this.token,
      },
      data: data,
    };

    return this.fetchJson(`${this.backendUrl}/publish-framez`, options);
  }

  async uploadAuthorAvatar(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this.token,
      },
      data: data,
    };

    return this.fetchJson(`${this.backendUrl}/upload/avatar`, options);
  }

  async updateAuthor(data) {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
      data: JSON.stringify(data),
    };

    return this.fetchJson(`${this.backendUrl}/update/author`, options);
  }
}
