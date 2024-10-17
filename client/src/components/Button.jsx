import React from 'react';

const Button = ({ 
    onClick, 
    children, 
    type = 'button', 
    className = '', 
    loading = false 
}) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className={`bg-blue-500 w-full p-2 rounded-2xl text-white transition duration-200 shadow-md ${className} ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

export default Button;
