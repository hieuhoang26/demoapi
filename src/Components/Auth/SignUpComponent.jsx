import { useFormik } from "formik";
import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import { useAuth } from '../Sercutiry/AuthContext';
import { SignupApi, LoginSocialApi } from '../API/BookStoreApi';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../../Configuration/FirebaseConfig";
import './Login.scss';

function SignUpComponent() {
    let Auth = useAuth();
    let navigate = useNavigate();
    const [isShowPassword, setShowPassword] = useState(true)

    const formik = useFormik({
        initialValues: {
            username: "",
            phoneNumber: "",
            email: "",
            password: "",
            roles: null
        },
        validationSchema: Yup.object({
            username: Yup.string()
                // .required("Required")
                .min(5, "Must be 5 characters or more"),
            email: Yup.string()
                // .required("Required")
                .matches(
                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    "Please enter a valid email address"
                ),
            password: Yup.string()
                // .required("Required")
                .matches(
                    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/,
                    "Password must be 7-19 characters and contain at least one letter, one number and a special character"
                ),
            confirmedPassword: Yup.string()
                // .required("Required")
                .oneOf([Yup.ref("password"), null], "Password must match"),
            phoneNumber: Yup.string()
                // .required("Required")
                .matches(
                    /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                    "Must be a valid phone number"
                ),
        }),
        onSubmit: async (values) => {
            try {
                await SignupApi(values)
                toast.success("Register Success!")
                navigate("/login")
            } catch (error) {
                toast.warn("Register Failed!")
                console.log(error)
            }
        }
    });
    useEffect(() => {
        if (formik.submitCount > 0) {
            if (formik.errors.email) {
                toast.error(formik.errors.email);
            }
            if (formik.errors.username) {
                toast.error(formik.errors.username);
            }
            if (formik.errors.password) {
                toast.error(formik.errors.password);
            }
            if (formik.errors.confirmedPassword) {
                toast.error(formik.errors.confirmedPassword);
            }
            if (formik.errors.phoneNumber) {
                toast.error(formik.errors.phoneNumber);
            }
        }
    }, [formik.submitCount]);
    // login google
    const handleGoogleSignin = () => {
        signInWithPopup(auth, googleProvider)
            .then(async (response) => {
                var decoded = jwt_decode(response.user.accessToken);
                try {
                    let response = await LoginSocialApi({
                        username: decoded.user_id,
                        email: decoded.email,
                        socialId: decoded.user_id,
                        type: "0"
                    })
                    Auth.setAuthenticated(true)
                    Auth.setRoles(response.data.roles);
                    sessionStorage.setItem("isAuthenticated", JSON.stringify(true))
                    sessionStorage.setItem("roles", JSON.stringify(response.data.roles))
                    sessionStorage.setItem("userId", response.data.id);
                    sessionStorage.setItem("username", response.data.username)
                    sessionStorage.setItem("token", response.data.token)
                    sessionStorage.setItem("refreshToken", response.data.refreshToken)
                    toast.success("Login Success")
                    navigate("/home")
                }
                catch (error) {
                    toast.error("Login Failed")
                    console.log(error)
                }
            })
            .catch((error) => console.log(error))
    }

    // login facebook;
    const handleFacebookSignin = () => {
        signInWithPopup(auth, facebookProvider)
            .then(async (response) => {
                var decoded = jwt_decode(response.user.accessToken);
                try {
                    let response = await LoginSocialApi({
                        username: decoded.user_id,
                        email: decoded.email,
                        socialId: decoded.user_id,
                        type: "1"
                    })
                    Auth.setAuthenticated(true)
                    Auth.setRoles(response.data.roles);
                    sessionStorage.setItem("isAuthenticated", JSON.stringify(true))
                    sessionStorage.setItem("roles", JSON.stringify(response.data.roles))
                    sessionStorage.setItem("userId", response.data.id);
                    sessionStorage.setItem("username", response.data.username)
                    sessionStorage.setItem("token", response.data.token)
                    sessionStorage.setItem("refreshToken", response.data.refreshToken)
                    toast.success("Login Success")
                    navigate("/home")
                }
                catch (error) {
                    toast.error("Login Failed")
                    console.log(error)
                }
            })
            .catch((error) => console.log(error))
    }
    const BackHomePage = () => {
        navigate("/")
    }
    const GoToLogin = () => {
        navigate("/login")
    }

    return (
        <div className="login-page">
            <div className="row d-flex justify-content-center mt-5" style={{ width: '35%' }}>
                <div className="card py-3 px-2">
                    <div className="title">
                        Sign Up
                    </div>
                    <form className="myform">
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                className="form-control"
                                placeholder="Email"
                                onChange={formik.handleChange} />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formik.values.username}
                                className="form-control"
                                placeholder="UserName"
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="form-group showpass">
                            <input
                                type={isShowPassword ? "password" : "text"}
                                id="password"
                                name="password"
                                value={formik.values.password}
                                className="form-control"
                                placeholder="Password"
                                onChange={formik.handleChange}
                            />
                            {isShowPassword ?
                                <span className='icons-eye'
                                    onClick={() => { setShowPassword(false) }}
                                >
                                    <i class="bi bi-eye-slash-fill"></i>
                                </span>
                                :
                                <span className='icons-eye'
                                    onClick={() => { setShowPassword(true) }}
                                >
                                    <i class="bi bi-eye-fill"></i>
                                </span>}
                        </div>
                        <div className="form-group showpass">
                            <input
                                id="confirmedPassword"
                                name="confirmedPassword"
                                type={isShowPassword ? "password" : "text"}
                                value={formik.values.confirmedPassword}
                                className="form-control"
                                placeholder="Confirm your password"
                                onChange={formik.handleChange}
                            />
                            {isShowPassword ?
                                <span className='icons-eye'
                                    onClick={() => { setShowPassword(false) }}
                                >
                                    <i class="bi bi-eye-slash-fill"></i>
                                </span>
                                :
                                <span className='icons-eye'
                                    onClick={() => { setShowPassword(true) }}
                                >
                                    <i class="bi bi-eye-fill"></i>
                                </span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formik.values.phoneNumber}
                                className="form-control"
                                placeholder="Phone Number"
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="form-group mt-3 d-flex justify-content-center">
                            <button type="button" className="btn btn-block btn-primary btn-lg w-100 "
                                onClick={formik.handleSubmit}
                            >
                                <small><i className="far fa-user pr-2"></i>SignUp</small>
                            </button>
                        </div>
                    </form>
                    <div className="row pt-3 align-self-center">
                        <span>Have acccount yet?
                            <span className='p-1 text-decoration-underline signup'
                                onClick={() => { GoToLogin() }}
                            >Login</span>
                        </span>
                    </div>
                    <div className="row pt-2 align-self-center">
                        <p className=' text-decoration-underline signup' onClick={() => { BackHomePage() }}>&#60;&#60;&#60; Back</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SignUpComponent;