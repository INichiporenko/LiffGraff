import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {Link, useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import style from "./AuthorizationForm.module.css";
import {AppDispatch, RootState} from "../../store/store.ts";
import {registerUser, resetPassword, userLogin} from "../../store/actionCreators/authActionCreators.ts";
import {LoginDataType, RegisterDataType, ResetDataType} from "../../store/types/authTypes.ts";
import { clearAuthError } from "../../store/slices/authSlice.ts";
import { setAuthUser } from "../../store/slices/userSlice.ts";
import { fetchUser } from "../../store/actionCreators/userActionCreators.ts";

type FormInputs = {
    email?: string,
    usernameOrEmail?: string
    fullName?: string,
    username?: string,
    password: string
};

type AuthorizationFormProps = {
    type: string
}

export const AuthorizationForm = ({type}: AuthorizationFormProps) => {
    const {error} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>();

    useEffect(() => {
        dispatch(clearAuthError());
    }, [type, dispatch]);

    const accountAlreadyExists =
        type === "register" &&
        error?.toLowerCase().includes("already exists");

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (type === "register") {
            try {
                if(data.username && data.email && data.fullName) {
                    const dataRegister: RegisterDataType = {
                        username: data.username,
                        email: data.email,
                        password: data.password,
                        fullName: data.fullName,
                    }
                    const result = await dispatch(registerUser(dataRegister));
                    if (registerUser.fulfilled.match(result)) {
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('Error during registering:', error);
            }
        } else if (type === "login") {
            try {
                if(data.usernameOrEmail) {
                    const dataLogin: LoginDataType = {
                        usernameOrEmail: data.usernameOrEmail,
                        password: data.password,
                    };
                    const result = await dispatch(userLogin(dataLogin));
                    if (userLogin.fulfilled.match(result)) {
                        const { username, id, profile_image } = result.payload.data;
                        if (id && username) {
                            dispatch(setAuthUser({ _id: id, username, profile_image }));
                            dispatch(fetchUser({ username }));
                        }
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        } else if (type === "reset") {
            if(data.usernameOrEmail) {
                const dataReset: ResetDataType = {
                    usernameOrEmail: data.usernameOrEmail
                };
                dispatch(resetPassword(dataReset));

                navigate("/login");
            }
        }
    };

    let btnTitle;
    if (type === "register") {
        btnTitle = "Sign up"
    } else if (type === "login") {
        btnTitle = "Log in"
    } else if (type === "reset") {
        btnTitle = "Reset your password"
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${style.formContainer} flex flex-col gap-1.5 w-full`}
        >
            {type === "register" && (
                <>
                    <input {...register("email", {
                        required: "Email is required",
                        maxLength: { value: 254, message: "Email is too long" },
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                        },
                    })} placeholder="Email" type="email"/>
                    {errors.email && <span className={style.error}>{errors.email.message}</span>}
                    <input {...register("fullName", {
                        required: "Full name is required",
                        maxLength: { value: 64, message: "Full name must be at most 64 characters" },
                    })} placeholder="Full Name"/>
                    {errors.fullName && <span className={style.error}>{errors.fullName.message}</span>}
                    <input {...register("username", {
                        required: "Username is required",
                        maxLength: { value: 30, message: "Username must be at most 30 characters" },
                        pattern: {
                            value: /^[a-zA-Z0-9._]+$/,
                            message: "Username can only contain letters, numbers, dots and underscores",
                        },
                    })} placeholder="Username"/>
                    {errors.username && <span className={style.error}>{errors.username.message}</span>}
                    {error && (
                        <span className={style.error}>
                            {error}
                            {accountAlreadyExists && (
                                <>{" "}
                                    <Link className={style.errorLink} to="/login">Log in</Link>
                                </>
                            )}
                        </span>
                    )}
                </>
            )
            }
            {type !== "register" && (
                <>
                    <input {...register("usernameOrEmail", {
                        required: "Username or email is required",
                        maxLength: { value: 254, message: "Username or email is too long" },
                    })} placeholder="Username or email"/>
                    {errors.usernameOrEmail &&
                        <span className={style.error}>{errors.usernameOrEmail.message}</span>}
                    {error && <span className={style.error}>{error}</span>}
                </>)}
            {type !== "reset" && (<>
                <input type="password" {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                })} placeholder="Password"/>
                {errors.password && <span className={style.error}>{errors.password.message}</span>}
            </>)}
            {type === "register" && (
                <>
                    <p className="text-xs mt-2.5 mb-4">
                        People who use our service may have uploaded your contact information to
                        LifeGraff. <a
                            className="text-darkblue cursor-pointer">Learn More</a></p>
                    <p className="text-xs mb-4">By signing up, you agree to our <a
                            className="text-darkblue cursor-pointer">Terms</a>, <a
                            className="text-darkblue cursor-pointer">Privacy
                            Policy</a> and <a className="text-darkblue cursor-pointer">Cookies Policy</a>.</p>
                </>
            )}
            <button className="mt-3.5" type="submit">{btnTitle}</button>
        </form>
    );
}