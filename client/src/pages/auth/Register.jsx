import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phoneNumber) e.phoneNumber = "Phone is required";
    else if (!/^\d{10}$/.test(form.phoneNumber))
      e.phoneNumber = "Enter a 10-digit phone number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
        Create your account
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Join thousands of travellers
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          placeholder="John Doe"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          error={errors.fullName}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Phone"
          placeholder="10-digit number"
          value={form.phoneNumber}
          onChange={(e) =>
            setForm({
              ...form,
              phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
            })
          }
          error={errors.phoneNumber}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
};

export default Register;