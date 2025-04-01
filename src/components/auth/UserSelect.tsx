"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/prisma";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { getUsers } from "@/actions/users";
import { LogOut } from "lucide-react";

export default function UserSelect() {
  const { user, login, logout } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from the API
    async function fetchUsers() {
      try {
        const { users, error } = await getUsers();

        if (users) {
          setUsers(users);
        } else if (error) {
          console.error("Failed to fetch users:", error);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleUserSelect = (selectedUser: User) => {
    login(selectedUser);
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">User Selection</h2>

      {user ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-2 text-sm text-gray-500">
            Please select a user to continue:
          </p>

          {loading ? (
            <div className="py-2 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
            </div>
          ) : (
            <select
              className="w-full rounded-md border border-input px-3 py-2"
              onChange={(e) => {
                const selectedUser = users.find((u) => u.id === e.target.value);
                if (selectedUser) handleUserSelect(selectedUser);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
