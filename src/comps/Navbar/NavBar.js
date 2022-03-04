// Style
import './NavBar.css';

// Components
import {NavLink} from "react-router-dom";

const NavBar = () => {
    return(
        <>
            <nav>
                <NavLink to="/">
                    Home 
                </NavLink>
                <NavLink to="/newscan">
                    New Scan
                </NavLink>
                <NavLink to="/scanschedule">
                    Scan Schedules
                </NavLink>
                <NavLink to="/scanreports">
                    Scan Reports
                </NavLink>
            </nav>
        </>
        
    )
}
    




export default NavBar;
