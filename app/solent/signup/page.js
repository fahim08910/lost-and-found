import SignupComponent from 'app/ui/signup';
import Link from 'next/link';
import "app/solent/solent.css";

async function Page() {
    function pauser(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }
    await pauser(3000);
    return (
        <div>
            <SignupComponent />
            <p id="loginText">
                Already have an account?
                <Link href="/solent/login">
                    Login
                </Link>
            </p>
        </div>
    );
}
export default Page;
