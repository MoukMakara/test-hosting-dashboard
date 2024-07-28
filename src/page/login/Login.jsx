import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { FaUser, FaEye, FaEyeSlash, FaCheckSquare } from "react-icons/fa";
import { ImCheckboxUnchecked } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import registerImg from "../../assets/SportHubLogo.png";
import toast, { Toaster } from "react-hot-toast";
import { fetchLogin } from "../../redux/feature/auth/loginSlice";
import { getAccessToken } from "../../../src/lib/secureLocalStorage";

const initialValues = {
  email: "admin@gmail.com",
  password: "Admin@12345",
};
// const initialValues = {
//   email: "",
//   password: "",
// };

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email is incorrect").required("Email is required"),
  password: Yup.string()
    .test("is-strong", function (value) {
      const { path, createError } = this;
      const errors = [];
      if (!/^(?=.*[A-Z])/.test(value))
        errors.push("Capital Letter is required");
      if (!/^(?=.*[a-z])/.test(value))
        errors.push("Lowercase Letter is required");
      if (!/^(?=.*\d)/.test(value)) errors.push("Number is required");
      if (!/^(?=.*[!@#$%^&*])/.test(value))
        errors.push("Special Character is required");
      if (value && value.length < 6)
        errors.push("Must be at least 6 characters");

      return (
        errors.length === 0 ||
        createError({
          path,
          message: `The password must contain: ${errors.join(", ")}`,
        })
      );
    })
    .required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const handleLogin = async (values) => {
    try {
      await dispatch(fetchLogin(values)).then(() => {
        const token = getAccessToken();
        console.log("Data", token);
        if (token) {
          setAccessToken(token);
        } else {
          toast.error("Email or password is incorrect !");
        }
      });
    } catch (error) {
      toast.error("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <>
      <section className="h-screen flex justify-center items-center flex-col mx-auto px-4 sm:px-6 bg-[#222162]">
        <Toaster position="top-right" reverseOrder={true} />
        <section className="flex justify-center items-center flex-row gap-8 w-full max-w-md sm:max-w-lg lg:max-w-3xl bg-gray-200 p-8 rounded-lg">
          <section className="hidden lg:block w-[320px] h-full">
            <img
              src={registerImg}
              alt="image"
              className="w-full h-full object-cover rounded-lg"
            />
          </section>
          <section className="w-[350px] h-auto flex justify-center items-center flex-col mx-auto">
            <h2 className="text-center text-xl sm:text-2xl md:text-3xl text-[#222162] font-bold pb-2">
              SportHub
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleLogin(values);
                resetForm();
              }}
            >
              <Form>
                <section className="w-[280px] lg:w-[320px] h-full flex items-center flex-col">
                  <div className="relative-label mt-5">
                    <div className="relative w-[280px] lg:w-[320px] h-[50px] flex items-center">
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="w-full h-full text-sm font-medium bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-white focus:border-none block pr-10 p-2.5"
                        placeholder=" "
                      />
                      <label
                        htmlFor="email"
                        className="absolute top-0 left-0 text-gray-500 text-sm transition-transform duration-300 ease-in-out"
                      >
                        Email
                      </label>
                      <FaUser className="absolute right-3 text-[#222162]" />
                    </div>
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="text-red-700 text-xs"
                    />
                  </div>

                  <div className="relative-label mt-4 flex flex-col justify-center w-full">
                    <div className="relative w-[280px] lg:w-[320px] h-[50px] flex items-center">
                      <Field
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="w-full h-full text-sm font-medium bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-white focus:border-none block pr-10 p-2.5"
                        placeholder=" "
                      />
                      <label
                        htmlFor="password"
                        className="absolute top-0 left-0 text-gray-500 text-sm transition-transform duration-300 ease-in-out"
                      >
                        Password
                      </label>
                      {showPassword ? (
                        <FaEye
                          className="absolute right-3 text-[#222162] cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <FaEyeSlash
                          className="absolute right-3 text-[#222162] cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    <ErrorMessage
                      component="div"
                      name="password"
                      className="text-red-700 text-sm"
                    />
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <button
                      type="submit"
                      className="w-[280px] lg:w-[320px] h-[50px] text-white bg-[#222162] font-semibold text-lg rounded-lg px-5 py-2.5 mt-5 focus:outline-none hover:bg-[#27268a]"
                    >
                      Login
                    </button>
                  </div>
                </section>
              </Form>
            </Formik>
          </section>
        </section>
      </section>
    </>
  );
}
