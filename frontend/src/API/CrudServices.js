import url from "@/feature/url";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
export class CrudServices {
  constructor() {
    this.link = url();
    this.token = useAuthHeader();
    this.backendUrl = this.link;
  }

  async handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, status: response.status };
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
    return this.fetchJson(`${this.backendUrl}/student/login`, options);
  }

  async createUser(data) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    };

    return this.fetchJson(`${this.backendUrl}/student/register`, options);
  }

  async getStudentDetails() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    };

    return this.fetchJson(`${this.backendUrl}/student/dashboard`, options);
  }

  async updateStudentProfile(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
      data: JSON.stringify(data),
    };
    return this.fetchJson(`${this.backendUrl}/student/update`, options);
  }

  async uploadProfileImage(data) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this.token,
      },
      data: data,
    };

    return this.fetchJson(`${this.backendUrl}/student/upload/avatar`, options);
  }

  async verifyOTP(userId, otp) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ userId, otp }),
    };

    return this.fetchJson(`${this.backendUrl}/student/verify`, options);
  }

  async resendOTP(userId) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ userId }),
    };

    return this.fetchJson(`${this.backendUrl}/student/resendOTP`, options);
  }

  async resetPassword(email, currentPassword, newPassword) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email,
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    };

    return this.fetchJson(`${this.backendUrl}/student/resetPassword`, options);
  }

  async forgotPassword(email, password, otp) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ email, password, otp }),
    };

    return this.fetchJson(`${this.backendUrl}/student/forgotPassword`, options);
  }

  async sendOTP(email) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ email }),
    };

    return this.fetchJson(`${this.backendUrl}/student/sendOTP`, options);
  }
}
