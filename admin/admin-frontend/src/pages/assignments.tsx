import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
    GET_USERS,
    GET_COURSES,
    ASSIGN_LECTURER,
    GET_COURSE_MAPPINGS,
} from "../services/api";
import Layout from "@/components/Layout";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Assignments() {
    const router = useRouter();
    const { data: usersData } = useQuery(GET_USERS);
    const { data: coursesData } = useQuery(GET_COURSES);
    const { data: mappingsData, refetch } = useQuery(GET_COURSE_MAPPINGS);
    const [assignLecturer] = useMutation(ASSIGN_LECTURER);

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedCourseCode, setSelectedCourseCode] = useState<string>("");

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        if (!isAuthenticated) router.push('/login');
    }, [router]);


    //   const lecturers = usersData?.getUsers?.filter((u: any) => u.role === "lecturer");
    const lecturers = usersData?.getUsers?.filter(
        (u: any) => u.role && u.role.toLowerCase() === "lecturer" && u.isValid === true
    );

    console.log(lecturers);
    const allMappings = mappingsData?.getCourseMappings || [];

    const handleAssign = async () => {
        if (!selectedUserId || !selectedCourseCode) {
            alert("Please select both lecturer and course.");
            return;
        }

        const isAlreadyMapped = allMappings.some(
            (m: any) => m.userId === selectedUserId && m.courseCode === selectedCourseCode
        );

        if (isAlreadyMapped) {
            alert("This lecturer is already assigned to this course.");
            return;
        }

        await assignLecturer({ variables: { userId: selectedUserId, courseCode: selectedCourseCode } });
        alert("Lecturer assigned successfully!");
        setSelectedUserId(null);
        setSelectedCourseCode("");
        refetch();
    };

    return (
        <Layout>
            <div className="min-h-screen p-8 bg-white text-gray-800">
                <h1 className="text-2xl font-bold mb-6">Assign Lecturers to Courses</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Select Lecturer</h2>
                        <select
                            value={selectedUserId ?? ""}
                            onChange={(e) => setSelectedUserId(Number(e.target.value))}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">-- Select Lecturer --</option>
                            {lecturers?.map((u: any) => (
                                <option key={u.id} value={u.id}>
                                    {u.firstName} {u.lastName} ({u.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Select Course</h2>
                        <select
                            value={selectedCourseCode}
                            onChange={(e) => setSelectedCourseCode(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">-- Select Course --</option>
                            {coursesData?.getCourses?.map((c: any) => (
                                <option key={c.code} value={c.code}>
                                    {c.code} - {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleAssign}
                        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
                    >
                        Assign Lecturer
                    </button>
                </div>

                {/* Mappings Table */}
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Lecturer-Course Mappings</h2>
                    <table className="w-full text-sm border">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="p-2 text-left">Lecturer Name</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-left">Course Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allMappings.map((m: any, idx: number) => {
                                const user = usersData?.getUsers?.find((u: any) => u.id === m.userId);
                                return (
                                    <tr key={idx} className="border-t">
                                        <td className="p-2">{user?.firstName} {user?.lastName}</td>
                                        <td className="p-2">{user?.email}</td>
                                        <td className="p-2">{m.courseCode}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
