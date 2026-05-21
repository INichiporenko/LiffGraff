import {Link} from "react-router";
import {BrandLogo} from '../../components/BrandLogo/BrandLogo.tsx';
import lock from '../../assets/lock.svg';
import {AuthorizationForm} from "../../components/AuthorizartionForm/AuthorizationForm.tsx";

export const ResetPage = () => {
    return (
        <>
            <Link to="/login" className="inline-block mx-11 my-5"><BrandLogo size="md"/></Link>
            <hr className="text-gray"/>
            <div className="flex flex-col items-center justify-center w-full">
                <div
                    className="w-[90%] sm:w-[390px] border border-gray flex flex-col
                     items-center justify-center mt-[84px] px-10 py-10">
                    <img src={lock} alt="Lock"/>
                    <p className="font-semibold text-center mt-3.5">Trouble logging in?</p>
                    <p className="text-darkgray text-center mb-3 mt-3 text-sm">
                        Enter your email, phone, or username and we'll
                        send you a link to get back into your account.</p>
                    <AuthorizationForm type="reset"/>
                    <div className="flex gap-4 justify-center items-center text-gray mt-12 mb-4">
                        <p>__________</p>
                        <p className="pt-3.5 text-xs text-darkgray">OR</p>
                        <p>__________</p>
                    </div>
                    <Link className="text-sm mb-12 font-semibold" to="/reset">Create new account</Link>
                </div>
                <div className="w-[90%] sm:w-[390px] border border-gray bg-[#FAFAFA]
                    border-t-0 flex items-center justify-center py-4">
                    <Link className="text-sm font-semibold" to="/login">Back to login</Link>
                </div>
            </div>
        </>
    );
};