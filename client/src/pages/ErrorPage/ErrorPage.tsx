import image from '../../assets/login_back.png'

export const ErrorPage = () => {
    return (
        <div className="flex flex-col md:flex-row justify-center
         md:items-start items-center mt-20 md:gap-12 px-3.5">
            <img src={image} alt='Image'
            className="w-fit md:h-fit h-[320px]"/>
            <div className=" mt-12">
                <p className="text-[36px] font-bold">Oops! Page Not Found (404 Error)</p>
                <p className="max-w-[475px] text-darkgray">
                    We're sorry, but the page you're looking for doesn't seem to exist.
                    If you typed the URL manually, please double-check the spelling.
                    If you clicked on a link, it may be outdated or broken.</p>
            </div>
        </div>
    );
};