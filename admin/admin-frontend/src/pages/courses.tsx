import { useQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Layout from '../components/Layout';

import {
    GET_COURSES,
    ADD_COURSE,
    EDIT_COURSE,
    DELETE_COURSE,
} from '../services/api'

export default function Courses() {
    const router = useRouter();
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        if (!isAuthenticated) router.push('/login');
    }, [router]);

    const { data, loading, error, refetch } = useQuery(GET_COURSES);
    const [addCourse] = useMutation(ADD_COURSE);
    const [editCourse] = useMutation(EDIT_COURSE);
    const [deleteCourse] = useMutation(DELETE_COURSE);

    const [newCode, setNewCode] = useState('');
    const [newName, setNewName] = useState('');
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editAvailable, setEditAvailable] = useState(true);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCode || !newName) return;
        await addCourse({ variables: { code: newCode, name: newName } });
        setNewCode('');
        setNewName('');
        refetch();
    };

    const handleEdit = async (code: string) => {
        await editCourse({ variables: { code, name: editName, isAvailable: editAvailable } });
        setEditMode(null);
        refetch();
    };

    const handleDelete = async (code: string) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse({ variables: { code } });
                refetch();
            } catch (err: any) {
                const errorMessage =
                    err?.message || "Failed to delete course. It may be in use.";
                alert(errorMessage);
            }
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (error) return <p className="p-6 text-red-600">Error loading courses.</p>;

    return (
        <Layout>
            <div className="min-h-screen p-8 bg-white text-gray-800">

                <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

                <form onSubmit={handleAdd} className="mb-6 flex gap-4">
                    <input
                        type="text"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="New Course Code"
                        className="border px-3 py-2 rounded w-1/4"
                    />
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Course Name"
                        className="border px-3 py-2 rounded w-1/2"
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                        Add Course
                    </button>
                </form>

                <table className="w-full text-sm border">
                    <thead className="bg-purple-100">
                        <tr>
                            <th className="p-2 text-left">Code</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Available</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.getCourses.map((course: any) => (
                            <tr key={course.code} className="border-t">
                                <td className="p-2">{course.code}</td>
                                <td className="p-2">
                                    {editMode === course.code ? (
                                        <input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="border px-2 py-1 w-full"
                                        />
                                    ) : (
                                        course.name
                                    )}
                                </td>
                                <td className="p-2">
                                    {editMode === course.code ? (
                                        <select
                                            value={editAvailable ? 'true' : 'false'}
                                            onChange={(e) => setEditAvailable(e.target.value === 'true')}
                                            className="border px-2 py-1"
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    ) : course.isAvailable ? 'Yes' : 'No'}
                                </td>
                                <td className="p-2 flex gap-2">
                                    {editMode === course.code ? (
                                        <>
                                            <button
                                                onClick={() => handleEdit(course.code)}
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditMode(null)}
                                                className="bg-gray-400 text-white px-2 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditMode(course.code);
                                                    setEditName(course.name);
                                                    setEditAvailable(course.isAvailable);
                                                }}
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.code)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
