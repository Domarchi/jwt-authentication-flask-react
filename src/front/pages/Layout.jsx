import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"

// Base component shared by every page.
export const Layout = () => {
    return (
        <ScrollToTop>
            <Navbar />
            <Outlet />
        </ScrollToTop>
    )
}
