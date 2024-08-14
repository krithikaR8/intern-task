import React, { Component } from 'react';

import { Navigate } from "react-router-dom";


const withAuthentication = (WrappedComponent) => {
  return class extends Component {
    isAuthenticated() {
      
      const accessToken = sessionStorage.getItem('accesstoken');
     
        return accessToken;
    }

    render() {
      if (this.isAuthenticated()) {
        return <WrappedComponent {...this.props} />;
      } else {
        
        return <Navigate to="/" />;
      }
    }
  };
};

export default withAuthentication;