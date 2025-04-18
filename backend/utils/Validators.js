class Validator {
  static async validateEntity(entityType, data) {
    switch (entityType) {
      case "student":
        return this.validateFields(data, [
          "name",
          "username",
          "email",
          "phone",
          "password",
          "confirmPassword",
          "gender",
          "institution",
        ]);
      case "institution":
        return this.validateFields(data, [
          "name",
          "email",
          "phone",
          "password",
          "confirmPassword",
          "address",
        ]);
      // Add more cases for other entity types as needed
      default:
        throw new Error("Invalid entity type");
    }
  }

  static async validateFields(data, fieldsToValidate) {
    const validationRules = {
      name: { required: true, minLength: 4 },
      username: { required: true, minLength: 4 },
      email: { required: true, format: /\S+@\S+\.\S+/ },
      phone: { required: true, format: /^\d{10}$/ },
      password: { required: true, minLength: 6 },
      confirmPassword: { required: true, matchField: "password" },
      gender: { required: true, enum: ["male", "female", "others"] },
      address: { required: true },
      institution: { required: true },
    };

    for (const field of fieldsToValidate) {
      const rule = validationRules[field];
      if (!rule) {
        throw new Error(`No validation rule found for field: ${field}`);
      }

      if (rule.required && !data[field]) {
        return { success: false, message: `${field} is required` };
      }
      if (rule.minLength && data[field].length < rule.minLength) {
        return {
          success: false,
          message: `${field} must be at least ${rule.minLength} characters long`,
        };
      }
      if (rule.format && !rule.format.test(data[field])) {
        return { success: false, message: `Invalid ${field}` };
      }
      if (rule.enum && !rule.enum.includes(data[field])) {
        return { success: false, message: `Invalid value for ${field}` };
      }
      if (rule.matchField && data[field] !== data[rule.matchField]) {
        return {
          success: false,
          message: `${field} does not match ${rule.matchField}`,
        };
      }
    }

    // Check password strength
    const passwordStrength = this.checkPasswordStrength(data.password);
    if (!passwordStrength.success) {
      return passwordStrength;
    }

    return { success: true };
  }

  static checkPasswordStrength(password) {
    const requirements = {
      number: /\d/,
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      specialChar: /[!@#$%^&*]/,
    };

    const message = [];

    for (const key in requirements) {
      if (!password.match(requirements[key])) {
        message.push(`at least one ${key}`);
      }
    }

    if (message.length > 0) {
      return {
        success: false,
        message: `Password must contain ${message.join(", ")}`,
      };
    }

    return { success: true };
  }
}

export default Validator;
