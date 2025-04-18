import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import url from "../feature/url";

export class CrudServices {
  link = url();
  token = useAuthHeader();
  constructor() {
    this.backendUrl = `${this.link}/institution`;
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
  async signupUser(data) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    };

    return this.fetchJson(`${this.backendUrl}/register`, options);
  }
  async createAuthor(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
      data: data,
    };
    return this.fetchJson(`${this.backendUrl}/author/create`, options);
  }

  async createPublisher(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
      data: data,
    };
    return this.fetchJson(`${this.backendUrl}/publisher/create`, options);
  }
  async getInstitutionDetails() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
    };
    return this.fetchJson(`${this.backendUrl}/dashboard`, options);
  }

  async createOrder(amount) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
      data: JSON.stringify({ amount }),
    };
    return this.fetchJson(`${this.backendUrl}/payment/create-order`, options);
  }
  async verifyPayment(orderId, paymentId, signature, amount) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
      data: JSON.stringify({ orderId, paymentId, signature, amount }),
    };
    return this.fetchJson(`${this.backendUrl}/payment/verify`, options);
  }

  async transferCoins(publisherId, amount) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
      data: JSON.stringify({ publisherId, amount }),
    };
    return this.fetchJson(`${this.backendUrl}/transfer-coins`, options);
  }

  async updateInstitution(data) {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.token}`,
      },
      data: JSON.stringify(data),
    };
    return this.fetchJson(`${this.backendUrl}/update/profile`, options);
  }

  async uploadInstitutionAvatar(data) {
    const options = {
      method: "POST",
      headers: {
        Authorization: `${this.token}`,
      },
      data: data,
    };
    return this.fetchJson(`${this.backendUrl}/upload/avatar`, options);
  }

  async uploadInstitutionCoverImage(data) {
    const options = {
      method: "POST",
      headers: {
        Authorization: `${this.token}`,
      },
      data: data,
    };
    return this.fetchJson(`${this.backendUrl}/upload/cover-image`, options);
  }
}
