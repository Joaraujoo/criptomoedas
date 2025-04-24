import style from "./header.module.css"
import logo from "../../assets/logo.svg"

import { Link } from "react-router-dom"

export function Header(){
    return(
        <header className={style.container}>
            <Link to="/">
                <img src={logo} alt="Logo criptomoedas" />
            </Link>
        </header>
    )
}