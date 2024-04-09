import OrderHistory from 'app/ui/orderhistory';
import SuspenseLoading from 'app/ui/suspenseloading';
import { Suspense } from 'react';

function Page() {
    return (
        <div>
            <BasketPage />
        </div>
    );
}

export default Page;