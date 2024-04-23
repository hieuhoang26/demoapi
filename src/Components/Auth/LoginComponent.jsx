import * as Yup from "yup";
import { useState } from 'react';
import { useFormik } from "formik";
import { useAuth } from '../Sercutiry/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginApi, LoginSocialApi } from "../API/BookStoreApi";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../../Configuration/FirebaseConfig";
import './Login.scss';




function LoginComponent() {
    let Auth = useAuth();
    let navigate = useNavigate();
    const [isShowPassword, setShowPassword] = useState(true)
    const [isLoading, setIsLoading] = useState(false)


    // login local
    let formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Required"),
            password: Yup.string().required("Required")
        }),
        onSubmit: async (values) => {
            try {
                let response = await LoginApi(values)
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
            } catch (error) {
                toast.error("Login Failed")
                console.log(error)
            }
        }
    })

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
                    console.log(response)
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
                console.log(decoded)
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
    const GoToSignUp = () => {
        navigate("/signup")
    }

    // login github

    return (
        <div className="login-page">
            <div className="row d-flex justify-content-center mt-5" style={{ width: '35%' }}>
                <div className="card py-3 px-2">
                    <div className="title">
                        Login
                    </div>
                    <form className="myform">
                        <div className="form-group">
                            <input type="text"
                                id="username"
                                name="username"
                                value={formik.values.username}
                                className="form-control"
                                placeholder="User Name"
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="form-group showpass">
                            <input type={isShowPassword ? "password" : "text"}
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
                        <div className="row ">
                            <div className="col-md-6 col-12">
                                <div className="form-group form-check ">
                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                    <label className="form-check-label mt-1" htmlFor="exampleCheck1">Remember Password</label>
                                </div>
                            </div>
                            <div className="col-md-6 col-12 bn">Fogot Password?</div>
                        </div>
                        <div className="form-group btn-lg mt-3 d-flex justify-content-center">
                            <button type="button" className="btn btn-block w-100"
                                onClick={formik.handleSubmit}
                                disabled={isLoading}
                            >
                                <small>
                                    {isLoading === true &&
                                        <i class="bi bi-arrow-clockwise loaderIcon"></i>
                                    }
                                    <span>Login</span>
                                </small>
                            </button>
                        </div>
                    </form>
                    <p className="text-center mb-3 mt-2">Or Sign Up Using</p>
                    <div className="row mx-auto ">
                        <div className="col-4">
                            <i className="fab fa-twitter"></i>
                        </div>
                        <div className="col-4" onClick={handleFacebookSignin}>
                            <i className="fab fa-facebook"></i>
                        </div>
                        <div className="col-4" onClick={handleGoogleSignin}>
                            <i className="fab fa-google"></i>
                        </div>
                    </div>

                    <div className="row pt-3 align-self-center">
                        <span>Have not acccount yet?
                            <span className='p-1 text-decoration-underline signup'
                                onClick={() => { GoToSignUp() }}
                            >Sign Up</span>
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

export default LoginComponent;