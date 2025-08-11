import url from "@/feature/url";
import { CrudServices } from "./CrudServices";

export class FeedService extends CrudServices {
  link = url();
  constructor() {
    super();
    this.backendUrl = this.link;
  }

  async getAllPosts() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };

    return this.fetchJson(`${this.backendUrl}/feed`, options);
  }

  async getAllFeedPosts(page, seed, excludedPostIds = []) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };
    const excludedPostIdsQuery = encodeURIComponent(
      JSON.stringify(excludedPostIds),
    );

    return this.fetchJson(
      `${this.backendUrl}/feed?page=${page}&seed=${seed}&excludedPostIds=${excludedPostIdsQuery}`,
      options,
    );
  }

  async getPostsWithMaxLikes() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };

    return this.fetchJson(`${this.backendUrl}/feed/max/likes`, options);
  }

  async getDiscoverPosts(page, seed) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };

    return this.fetchJson(
      `${this.backendUrl}/feed/discover/all?page=${page}&seed=${seed}`,
      options,
    );
  }
  async getPost(id) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };

    return this.fetchJson(`${this.backendUrl}/feed/${id}`, options);
  }

  async likePost(id) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };

    return this.fetchJson(`${this.backendUrl}/feed/${id}/like`, options);
  }

  async followInstitute(id) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };
    return this.fetchJson(`${this.backendUrl}/feed/follow/${id}`, options);
  }

  // -H
  // Fixed Get Institution profile
  async GetInstitute(id) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };
    return this.fetchJson(`${this.backendUrl}/institution/find/${id}`, options);
  }

  async getAllKlipz() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };
    return this.fetchJson(`${this.backendUrl}/feed/klipz/all`, options);
  }

  async getAllFramez() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };
    return this.fetchJson(`${this.backendUrl}/feed/framez/all`, options);
  }

  async bookmarkPost(id) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };

    return this.fetchJson(`${this.backendUrl}/feed/${id}/bookmark`, options);
  }
}
