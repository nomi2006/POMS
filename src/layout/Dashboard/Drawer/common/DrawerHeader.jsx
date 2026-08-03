import { Link } from 'react-router-dom';
import React from "react";

import Image from 'react-bootstrap/Image';

import logo from 'assets/images/logo-white.svg';

export const DrawerHeader = () => {
  return (
    <div className="m-header">
      <Link to="/dashboard" className="b-brand text-primary">
        <Image src={logo} fluid className="logo logo-lg" alt="logo" />
      </Link>
    </div>
  );
};