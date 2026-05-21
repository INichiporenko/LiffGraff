import './App.css';
import {useLocation} from "react-router";
import {MainRouter} from './routes/MainRouter.tsx';
import {Navigation} from "./components/Layout/Navigation.tsx";
import {Footer} from "./components/Layout/Footer.tsx";
import {useScreenWidth} from "./utils/customHooks.ts";
import {AuthRoute} from "./routes/AuthRoute.tsx";
import {PrivateRoute} from "./routes/PrivateRoute.tsx";

function App() {
  const location = useLocation();
  const width = useScreenWidth();

  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/reset') {
    return <AuthRoute><MainRouter /></AuthRoute>
  } else {
    if (width > 768) {
      return (<PrivateRoute><div className="flex flex-col min-h-screen">
        <div className="flex flex-col md:flex-row">
          <Navigation/>
          <div className="w-full min-h-[calc(100vh-176px)]">
            <MainRouter/>
          </div>
        </div>
        <Footer/>
      </div></PrivateRoute>);
    } else {
      return (<PrivateRoute><div className="flex flex-col min-h-screen">
            <div className="flex flex-col md:flex-row overflow-y-scroll h-[calc(100vh-81px)]">
              <MainRouter/>
            </div>
          <Navigation/>
          </div></PrivateRoute>
        );
    }
  }
}

export default App
