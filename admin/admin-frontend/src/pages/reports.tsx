import React from 'react';
import { useQuery } from '@apollo/client';
import {
    GET_CANDIDATES_PER_COURSE_DETAILED,
    GET_OVERCHOSEN_CANDIDATES_DETAILED,
    GET_UNCHOSEN_CANDIDATES_DETAILED,
} from '../services/api';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function ReportsPage() {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        if (!isAuthenticated) router.push('/login');
    }, [router]);

    const { data: perCourseData } = useQuery(GET_CANDIDATES_PER_COURSE_DETAILED);
    const { data: overChosenData } = useQuery(GET_OVERCHOSEN_CANDIDATES_DETAILED);
    const { data: unchosenData } = useQuery(GET_UNCHOSEN_CANDIDATES_DETAILED);

    const downloadCSV = (csv: string, filename: string) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportCandidatesPerCourse = () => {
        let csv = 'Course Code,Name,Email\n';
        perCourseData?.getCandidatesPerCourseDetailed?.forEach((course: any) => {
            course.users.forEach((user: any) => {
                csv += `${course.courseCode},${user.firstName} ${user.lastName},${user.email}\n`;
            });
        });
        downloadCSV(csv, 'candidates_per_course.csv');
    };

    const exportOverChosenCandidates = () => {
        let csv = 'Name,Email\n';
        overChosenData?.getOverChosenCandidatesDetailed?.forEach((user: any) => {
            csv += `${user.firstName} ${user.lastName},${user.email}\n`;
        });
        downloadCSV(csv, 'over_chosen_candidates.csv');
    };

    const exportUnchosenCandidates = () => {
        let csv = 'Name,Email\n';
        unchosenData?.getUnchosenCandidatesDetailed?.forEach((user: any) => {
            csv += `${user.firstName} ${user.lastName},${user.email}\n`;
        });
        downloadCSV(csv, 'unchosen_candidates.csv');
    };

    return (
        <Layout>
            <div className="min-h-screen p-8 bg-gradient-to-r from-purple-100 to-purple-200 text-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-purple-800">Admin Reports</h1>
                </div>

                {/* Download Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={exportCandidatesPerCourse}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        📥 Download Candidates per Course
                    </button>
                    <button
                        onClick={exportOverChosenCandidates}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    >
                        📥 Download Over-Chosen Candidates
                    </button>
                    <button
                        onClick={exportUnchosenCandidates}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        📥 Download Unchosen Candidates
                    </button>
                </div>

                {/* Section 1 */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-2">📚 Candidates per Course</h2>
                    {perCourseData?.getCandidatesPerCourseDetailed?.map((course: any) => (
                        <div key={course.courseCode} className="mb-4 bg-white shadow rounded p-4">
                            <p className="font-bold text-purple-700">{course.courseCode}</p>
                            <ul className="list-disc list-inside text-gray-700 mt-2">
                                {course.users.map((u: any) => (
                                    <li key={u.id}>{u.firstName} {u.lastName} ({u.email})</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Section 2 */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-2">📈 Candidates in More Than 3 Courses</h2>
                    <ul className="list-disc list-inside bg-white shadow rounded p-4 text-gray-700">
                        {overChosenData?.getOverChosenCandidatesDetailed?.map((u: any) => (
                            <li key={u.id}>
                                {u.firstName} {u.lastName} ({u.email})
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Section 3 */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">🚫 Unchosen Candidates</h2>
                    <ul className="list-disc list-inside bg-white shadow rounded p-4 text-gray-700">
                        {unchosenData?.getUnchosenCandidatesDetailed
                            ?.filter((u: any) => u?.role?.toLowerCase() === "tutor" && u?.isValid)
                            .map((u: any) => (
                                <li key={u.id}>
                                    {u.firstName} {u.lastName} ({u.email})
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
}
