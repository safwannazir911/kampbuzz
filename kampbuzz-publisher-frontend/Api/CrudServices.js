import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import url from "../feature/url";

export class CrudServices {
  token = useAuthHeader();
  link = url();
  constructor() {
    this.backendUrl = `${this.link}/publisher`;
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
      // console.error("Fetch error:", error);
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

  // 
  // API call to fetch dashboard details for publisher
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

  // 
  // API call to create an author by a publisher
  async CreateAuthor(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: this.token,
      },
      data: JSON.stringify(data),
    };

    return this.fetchJson(`${this.backendUrl}/create-author`, options);
  }

  // 
  // API call to change the status of a post
  async ChangeStatus(data, type) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: this.token,
      },
      data: JSON.stringify(data),
    };

    let url = `${this.backendUrl}`;
    if (type === "post") {
      url += "/review-post";
    } else if (type === "klip") {
      url += "/review-klipz";
    } else if (type === "frame") {
      url += "/review-framez";
    }

    return this.fetchJson(url, options);
  }


  async updatePublisher(data) {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: this?.token,
      },
      data: JSON.stringify(data),
    };

    return this.fetchJson(`${this.backendUrl}/update/publisher`, options);
  }

  async uploadPublisherAvatar(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: this?.token,
      },
      data: data,
    };

    return this.fetchJson(`${this.backendUrl}/upload/avatar`, options);
  }
}
