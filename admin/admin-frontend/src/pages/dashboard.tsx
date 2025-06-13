import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        if (!isAuthenticated) router.push('/login');
    }, [router]);

    return (
        <Layout>
            <div className="min-h-screen bg-purple-100 flex items-center justify-center px-6">
                <div className="bg-white rounded-lg shadow-lg p-10 max-w-4xl w-full">
                    <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">🎛️ Admin Dashboard</h1>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <li className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg shadow transition">
                            <Link href="/courses" className="block text-lg text-purple-800 font-semibold hover:underline">
                                ➕ Manage Courses
                            </Link>
                            <p className="text-sm text-gray-600 mt-2">Create, edit, and delete courses for the semester.</p>
                        </li>

                        <li className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg shadow transition">
                            <Link href="/assignments" className="block text-lg text-purple-800 font-semibold hover:underline">
                                🧑‍🏫 Assign Lecturers
                            </Link>
                            <p className="text-sm text-gray-600 mt-2">Assign lecturers to the available courses.</p>
                        </li>

                        <li className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg shadow transition">
                            <Link href="/candidates" className="block text-lg text-purple-800 font-semibold hover:underline">
                                🚫 Block/Unblock Candidates
                            </Link>
                            <p className="text-sm text-gray-600 mt-2">Control candidate access to the system.</p>
                        </li>

                        <li className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg shadow transition">
                            <Link href="/reports" className="block text-lg text-purple-800 font-semibold hover:underline">
                                📊 View Reports
                            </Link>
                            <p className="text-sm text-gray-600 mt-2">Generate and download tutor assignment reports.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}
