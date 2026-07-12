import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const login = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          navigate("/login");
          return;
        }

        localStorage.setItem("verixa_token", token);

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        const { data } = await api.get("/users/profile");

        localStorage.setItem(
          "verixa_user",
          JSON.stringify(data.user)
        );

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "recruiter") {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/developer/dashboard");
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    login();
  }, [navigate, searchParams]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>

        <h2 className="mt-6 text-2xl font-bold">
          Signing you in...
        </h2>

        <p className="mt-2 text-slate-400">
          Please wait while we complete authentication.
        </p>
      </div>
    </div>
  );
}