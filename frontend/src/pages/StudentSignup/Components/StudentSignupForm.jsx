import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import GoogleLogo from "../../../asset/GoogleLogo.png"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

import ReactSelect from "react-select" // Rename the import to avoid conflicts
import { CircleArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { interests, education, statesAndUTs, genders } from "../../../lib/data"
import { universitiesAndInstitutesNames } from "../../../lib/data"
import CommonCombinedInput from "../../../components/common/CommonCombinedInput"
import axios from "axios"
import url from "@/feature/url"

// Define form schema for the first section
const formSchema = z
  .object({
    name: z
      .string()
      .min(4, {
        message: "Name must have at least 4 characters.",
      })
      .max(25, {
        message: "Name can have at most 25 characters.",
      })
      .regex(/^[a-zA-Z ]+$/, {
        message: "Name should contain only alphabets.",
      }),
    username: z
      .string()
      .min(5, {
        message: "Username must have at least 5 characters.",
      })
      .max(20, {
        message: "Username can have at most 20 characters.",
      })
      .regex(/^[a-zA-Z0-9._]+$/, {
        message: "Only a-z A-Z 0-9 . _ allowed",
      }),
    email: z.string().email().max(320, {
      message: "Email can have at most 320 characters.",
    }),
    password: z
      .string()
      .min(6, {
        message: "Password should have at least 6 characters.",
      })
      .max(25, {
        message: "Password can have at most 25 characters.",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,25}$/, {
        message: "At least 1 lower, upper & special character",
      }),
    confirmPassword: z.string(),
    phone: z.string().refine((value) => /^\d{10}$/.test(value), {
      message:
        "Phone number must be exactly 10 digits long and contain only digits",
    }),
    gender: z.string().min(1), // Adjust the min length as needed
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

// Define form schema for the second section
const formSchemaTellUs = z.object({
  institution: z.string().min(1),
  highestQualification: z.string().min(1),
  homeState: z.string().min(1),
  interests: z.array(z.string()).min(1),
})

const StudentSignupForm = () => {
  // State to track whether to show the "Tell Us" section or not
  const [showTellUs, setShowTellUs] = useState(false)
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form for the first section
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  // React Hook Form for the second section
  const formTellUs = useForm({
    resolver: zodResolver(formSchemaTellUs),
  })

  const navigate = useNavigate()

  // Function to handle form submission for the first section
  const onSubmit = (values) => {
    setFormData(values)
  }

  const submitFormData = async (data) => {
    const formValues = {
      ...data,
      ...formData,
    }

    const link = url()
    setIsSubmitting(true)
    try {
      console.log(formValues)
      const response = await axios.post(
        `${link}/student/register`,
        formValues,
      )
      if (response.status === 201) {
        toast.success("Registered successfully!")
        //Redirect the user to /verify for email verification
        navigate(`/verify/${response.data.student._id}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message)
      }
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <div className="w-full flex justify-around items-center mt-2">
        <h1
          className={!showTellUs ? "sm:text-4xl text-2xl font-bold" : "hidden"}
        >
          Signup
        </h1>
        <h1
          className={showTellUs ? "sm:text-4xl text-2xl font-bold" : "hidden"}
        >
          Tell Us
        </h1>
        <h6 className="ml-1 sm:text-sm text-[10px]">
          Already have an account?{" "}
          <Link to="/login" className="hover:underline">
            <b>Login</b>
          </Link>
        </h6>
      </div>

      <div className="flex justify-center lg:mt-10 mt-2">
        <div className="max-w-xs lg:max-w-lg w-full flex flex-col p-2">
          <Form {...formTellUs}>
            <form
              onSubmit={formTellUs.handleSubmit(submitFormData)}
              className={
                showTellUs
                  ? "visible max-w-sm lg:max-w-lg w-full flex flex-col gap-4 p-2"
                  : "hidden"
              }
            >
              <FormField
                control={formTellUs.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where do you study?</FormLabel>
                    <FormControl>
                      <FormControl>
                        <ReactSelect
                          options={universitiesAndInstitutesNames}
                          placeholder="Where do you study"
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value) // Update form field value
                          }}
                        />
                      </FormControl>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={formTellUs.control}
                name="highestQualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your highest education level</FormLabel>
                    <FormControl>
                      <FormControl>
                        <ReactSelect
                          options={education}
                          placeholder="Select your highest level of education"
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value) // Update form field value
                          }}
                        />
                      </FormControl>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={formTellUs.control}
                name="homeState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Home State</FormLabel>
                    <FormControl>
                      <ReactSelect
                        options={statesAndUTs}
                        placeholder="Select your home state"
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption.value) // Update form field value
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={formTellUs.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What interests you?</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isMulti
                        options={interests}
                        placeholder="Select your interests"
                        onChange={(selectedOptions) => {
                          field.onChange(
                            selectedOptions.map((item) => item.value),
                          ) // Update form field value
                        }}
                        styles={{
                          placeholder: (provided) => ({
                            ...provided,
                            color: "black", // Set placeholder color to black
                          }),
                          dropdownIndicator: (provided) => ({
                            ...provided,
                            color: "black", // Set dropdown icon color to black
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: "#ddd1f9", // Set background color of selected items to purple
                            borderRadius: "20px", // Set rounded borders
                          }),
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="mb-1 flex justify-between ">
                <a
                  onClick={() => {
                    setShowTellUs(!showTellUs)
                  }}
                >
                  <CircleArrowLeft
                    size={42}
                    strokeWidth={0.5}
                    cursor="pointer"
                  />
                </a>

                <Button
                  type="submit"
                  className="px-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  disabled={isSubmitting}                
                  >
                  Signup
                </Button>
              </div>
            </form>
          </Form>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={
                !showTellUs
                  ? "visible max-w-sm lg:max-w-lg w-full flex flex-col gap-4 sm:p-4"
                  : "hidden"
              }
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <CommonCombinedInput
                        {...field}
                        placeholder="What should we call you?"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <CommonCombinedInput
                        {...field}
                        placeholder="Create your own username."
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <CommonCombinedInput
                        {...field}
                        placeholder="email@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <CommonCombinedInput
                            placeholder="Password"
                            type="password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {form.formState.errors.password && (
                        <FormMessage error>
                          {form.formState.errors.password.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword" // Add a new field for confirming password
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <CommonCombinedInput
                            placeholder="Confirm Password"
                            type="password"
                            {...field}
                          />{" "}
                        </div>
                      </FormControl>
                      {form.formState.errors.confirm && (
                        <FormMessage error>
                          {form.formState.errors.confirm.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <CommonCombinedInput
                        {...field}
                        placeholder="+91 0000000000"
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <FormControl>
                        <ReactSelect
                          options={genders}
                          placeholder="Select your gender"
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value) // Update form field value
                          }}
                        />
                      </FormControl>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="mb-1 flex justify-end items-center">
                <Button
                  type="submit"
                  onClick={() => {
                    if (
                      Object.keys(form.formState.errors).length === 0 &&
                      form.formState.submitCount != 0
                    ) {
                      // Change UI to TellUs form page only if there are no errors from Zod
                      setShowTellUs(true)
                    }
                  }}
                  className="px-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>

          <div className="flex items-center">
            <span className="w-[200px] h-[3px] bg-white inline border rounded-[10px]">
              {" "}
            </span>
            <span className="mb-1  p-2 text-black font-bold ">or</span>
            <span className="w-[200px] h-[3px] bg-white inline border rounded-[10px]">
              {" "}
            </span>
          </div>

          <div className="flex justify-center  items-center ">
            <img
              src={GoogleLogo}
              className="w-[36px] bg-white rounded-[100%]"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentSignupForm
