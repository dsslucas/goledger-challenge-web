import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useLocation } from "react-router";

const Breadcrumb = () => {
    const location = useLocation();

    // Divide a rota atual em partes
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <>
            {location.pathname !== "/home" && (
                <nav className="flex items-center px-10 text-gray-600 text-sm">
                    <ol className="inline-flex items-center space-x-1">
                        <li className="gap-x-2">
                            <Link to="/" className="flex items-center gap-x-2 hover:text-blue-500">
                                <FontAwesomeIcon icon={faHouse} />
                                Home
                            </Link>
                        </li>
                        {pathnames.map((value, index) => {
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                            const isLast = index === pathnames.length - 1;

                            return (
                                <li key={to} className="inline-flex items-center space-x-1">
                                    <span className="mx-2 text-gray-400">/</span>
                                    {isLast ? (
                                        <span className="text-gray-500">{String(value).charAt(0).toUpperCase() + String(value).slice(1)}</span>
                                    ) : (
                                        <Link to={to} className="flex items-center gap-x-2 hover:text-blue-500">
                                            {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            )}
        </>
    );
}

export default Breadcrumb