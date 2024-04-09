"use client"
import LoginForm from 'app/ui/login';
import Link from 'next/link';
import "app/solent/solent.css";

function LoginPage() {

    return (
        <div>
            <LoginForm onLoginSuccess={() => {}} />
            <p id="signupText">
                Don't have an account?
                <Link href="/solent/signup">
                    Sign up
                </Link>
                <Link href="/solent/forget">
                    Forgot pass
                </Link>
            </p>
        </div>
    );
}
export default LoginPage;
