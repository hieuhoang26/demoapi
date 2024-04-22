import HeaderComponent from './Components/Header/HeaderComponent';
import FooterComponent from './Components/Footer/FooterComponent'
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <HeaderComponent />
            <div className='outlet mb-5'>
                <Outlet />
            </div>
            <FooterComponent />
        </>
    )
};

export default Layout;