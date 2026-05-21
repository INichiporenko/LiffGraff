import {Link} from "react-router";
import style from "./RegisterPage.module.css";
import {BrandLogo} from "../../components/BrandLogo/BrandLogo.tsx";
import {AuthorizationForm} from "../../components/AuthorizartionForm/AuthorizationForm.tsx";

export const RegisterPage = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className={`${style.container} flex flex-col items-center justify-center
             border px-10 py-10 w-[90%] sm:w-[350px]`}>
                <BrandLogo size="lg"/>
                <p className="text-darkgray text-center
                mb-9 mt-4 text-md font-semibold">
                    Sign up to see photos and videos from your friends.</p>
                <AuthorizationForm type="register" />
            </div>
            <div className="flex items-center justify-center border border-gray
             py-[26px] w-[90%] sm:w-[350px] mt-6">
                <p className="text-center text-sm">
                    Have an account?
                    <Link className="text-blue" to="/login">Log in</Link>
                </p>
            </div>
        </div>
    )
};