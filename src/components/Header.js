import logo from "../images/Vector.svg"
import React from "react";


function Header () {
    return (
        <div className="header">
        <img src={logo} alt="Логотип" className="header__logo" />
      </div>
    )
}

export default Header