import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, BLOCK_CANDIDATE, UNBLOCK_CANDIDATE } from "../services/api";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Candidates() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [blockCandidate] = useMutation(BLOCK_CANDIDATE);
  const [unblockCandidate] = useMutation(UNBLOCK_CANDIDATE);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (!isAuthenticated) router.push("/login");
  }, [router]);

  const handleToggle = async (userId: number, isValid: boolean) => {
    if (isValid) {
      await blockCandidate({ variables: { userId } });
    } else {
      await unblockCandidate({ variables: { userId } });
    }
    refetch();
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error loading users.</p>;

  return (
    <Layout>
      <div className="min-h-screen p-8 bg-white text-gray-800">
        <h1 className="text-2xl font-bold mb-6">Candidate Login Control</h1>

        <table className="w-full text-sm border">
          <thead className="bg-purple-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.getUsers?.map((user: any) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">
                  {user.isValid ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Blocked</span>
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleToggle(user.id, user.isValid)}
                    className={`px-3 py-1 rounded text-white ${
                      user.isValid
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {user.isValid ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
