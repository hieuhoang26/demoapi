import { Link } from 'react-router-dom';
import { useAuth } from '../Sercutiry/AuthContext';
import './Header.scss';
import logo from '../../assets/circles.png'
import { useState, useEffect } from 'react';


function HeaderComponent() {
    let Auth = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        // <div className='nav'>
        //     <div className='left'>
        //         <Link className='logo' to="/home">BookStore</Link>
        //     </div>
        //     <div className='right'>
        //         {!Auth.isAuthenticated && <Link className="link" to="/signup">SignUp</Link>}
        //         {!Auth.isAuthenticated && <Link className="link" to="/login">Login</Link>}
        //         {Auth.isAuthenticated && <Link className="link" to="/cart">Cart</Link>}
        //         {Auth.isAuthenticated && Auth.roles.includes("ROLE_SHOP") && <Link className="link" to="/shop">Shop</Link>}
        //         {Auth.isAuthenticated && <Link className="link" to="/account">Account</Link>}
        //     </div>
        // </div>
        <div className={`app-bar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="toolbar">
                <Link to="/" className="title">
                    <img src={logo} alt="Book Store App" className="logo" />
                    <div className="title-text">BOOKSTORE</div>
                </Link>
                <div className="grow" />

                {Auth.isAuthenticated &&
                    <Link to="/cart" className="cart">
                        <div className="cart-icon">
                            <i class="bi bi-cart3" title='cart'></i>
                        </div>
                        {/* <div className="badge">{totalItems}</div> */}
                    </Link>
                }
                {Auth.isAuthenticated && Auth.roles.includes("ROLE_SHOP") &&

                    <Link to="/shop" className="cart">
                        <div className="shop-icon">
                            <i class="bi bi-shop" title='Shop'></i>
                        </div>
                    </Link>
                }
                {Auth.isAuthenticated &&
                    <Link to="/account" className="cart">
                        <div className="acc-icon">
                            <i class="bi bi-person-circle" title='Account'></i>
                        </div>
                    </Link>
                }
                {!Auth.isAuthenticated &&
                    <Link to="/login" className="login">
                        <button className="login-button">Login</button>
                    </Link>
                }

            </div>
        </div>

    )
}

export default HeaderComponent;