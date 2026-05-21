import {useLocation, Routes, Route} from "react-router";
import {
    EditProfilePage,
    ErrorPage,
    ExplorePage,
    HomePage,
    LoginPage, PostPage,
    ProfilePage,
    RegisterPage,
    ResetPage
} from "../pages";
import {MessagesPage} from "../pages/MessagesPage/MessagesPage.tsx";
import {MessagesMain} from "../components/MessagesMain/MessagesMain.tsx";
import {PostModal} from "../components/PostModal/PostModal.tsx";

export const MainRouter = () => {
    const location = useLocation();
    const state = location.state as { backgroundLocation?: Location };

    return (
        <>
            <Routes location={state?.backgroundLocation || location}>
                {/* Public Routes */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset" element={<ResetPage />} />

                {/* Protected Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/profile/:username/edit" element={<EditProfilePage />} />
                <Route path="/messages" element={<MessagesPage />}>
                    <Route path=":username" element={<MessagesMain />} />
                </Route>
                    <Route path="/explore" element={<ExplorePage />} />
                <Route path="/post/:postId" element={<PostPage />} />

                {/* Fallback Route */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>

            {/* Modal for Posts */}
            {state?.backgroundLocation && (
                <Routes>
                    <Route
                        path="/post/:postId"
                        element={<PostModal />}
                    />
                </Routes>
            )}
        </>
    );
};
