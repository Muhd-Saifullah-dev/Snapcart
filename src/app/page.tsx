import { auth } from '@/auth';
import AdminDashboard from '@/components/AdminDashboard';
import DeliveryBoy from '@/components/DeliveryBoy';
import DeliveryBoyDashboard from '@/components/DeliveryBoyDashboard';
import EditRoleMobile from '@/components/EditRoleMobile';
import GeoUpdater from '@/components/GeoUpdater';
import Nav from '@/components/Nav';
import UserDashboard from '@/components/UserDashboard';
import connectDb from '@/lib/db';
import User from '@/model/user.model';
import { redirect } from 'next/navigation';

async function Home() {
    await connectDb();
    const session = await auth();
    console.log('session ', session);
    const user = await User.findById(session?.user?.id);
    if (!user) {
        redirect('/login');
    }

    const inComplete =
        !user.mobile || !user.role || (!user.mobile && user.role == 'user');

    if (inComplete) {
        return <EditRoleMobile />;
    }

    const plainUser = JSON.parse(JSON.stringify(user));
    return (
        <>
            <Nav user={plainUser} />
            <GeoUpdater userId={plainUser._id} />
            {user.role == 'user' ? (
                <UserDashboard />
            ) : user.role == 'admin' ? (
                <AdminDashboard />
            ) : (
                <DeliveryBoy />
            )}
        </>
    );
}

export default Home;
