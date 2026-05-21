import {Link} from "react-router";
import {BrandLogo} from "../../components/BrandLogo/BrandLogo.tsx";
import login_back from "../../assets/login_back.png"
import {AuthorizationForm} from "../../components/AuthorizartionForm/AuthorizationForm.tsx";

export const LoginPage = () => {

    return (<div className="flex flex-col items-center justify-center w-full">
        <div className="flex gap-8 mt-20">
            <img className="hidden lg:block" src={login_back} alt="LifeGraff screenshot"/>
            <div>
                <div
                    className="flex flex-col items-center justify-center
                    border border-gray px-10 py-6 w-full sm:w-[350px] h-fit">
                    <BrandLogo className="my-6" size="lg"/>
                    <AuthorizationForm type="login"/>
                    <div className="flex gap-4 justify-center items-center text-gray mb-[70px] mt-4">
                        <p>__________</p>
                        <p className="pt-3.5 text-xs text-darkgray">OR</p>
                        <p>__________</p>
                    </div>
                    <Link className="text-darkblue text-xs" to="/reset">Forgot password?</Link>
                </div>
                <div className="flex items-center justify-center
                border border-gray py-[26px] mt-2.5 w-full sm:w-[350px]">
                    <p className="text-center text-sm">Don't have an account?
                        <Link className="text-blue" to="/register">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    </div>);
};