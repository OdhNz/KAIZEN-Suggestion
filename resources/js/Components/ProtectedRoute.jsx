import { redirect, useNavigate } from "react-router-dom";
import useStore from "../State/useStore";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [pathNavigate, setPathNavigate] = useState("");
    const { token, user } = useStore();
    const { roles } = props;
    const { path } = useStore();
    const now = Math.floor(new Date().getTime() / 1000);

    useEffect(() => {
        if (!token || user?.exp < now) {
            toast.warning("Your login session has expired! ");
            return navigate(`${path}/login`, { replace: true });
        }
        if (roles && !roles.includes(user.role)) {
            toast.warning("You don't have access! ");
            return navigate(`${path}/`, { replace: true });
        }
    }, [navigate]);
    return props.children;
};

export default ProtectedRoute;
