import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/constants";
import { deleteUser, getUsers, getCurrentUser } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { queryClient } from "@/routes/__root";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { UserType } from "@/lib/types";
import { EditUserModal } from "./EditUserModal";

const UsersAdminList: React.FC<{ className?: string }> = ({ className }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: getUsers,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {data?.length === 0 && <div>No users found</div>}
      {data?.map((user) => <UserCard key={user.id} user={user} />)}
    </div>
  );
};

const UserCard = ({ user }: { user: UserType }) => {
  const [open, setOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);

  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  const { mutateAsync } = useMutation({
    mutationFn: deleteUser,
  });

  const handleDeleteUser = async (id: string) => {
    // console.log("currentUser", currentUser);
    if (currentUser && currentUser.username === user.username) {
      // console.log("currentUser", currentUser);
      toast.error("You cannot delete your own account while logged in");
      return;
    }

    const mutate = mutateAsync(id, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USERS],
        });
      },
    });

    toast.promise(mutate, {
      loading: "Deleting...",
      success: "User deleted",
      error: "Failed to delete user",
    });
  };

  const handleOpen = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      <Card key={user.id} className="flex justify-between">
        <CardHeader>
          <h3>{user.username}</h3>
        </CardHeader>
        <CardContent className="flex gap-2 mt-6">
          <Edit
            onClick={() => {
              setOpen(true);
            }}
            className="stroke-gray-500 cursor-pointer hover:stroke-gray-800"
          />

          <Trash
            className="stroke-red-500 cursor-pointer hover:stroke-red-800"
            onClick={() => {
              handleDeleteUser(user.id.toString());
            }}
          />
        </CardContent>
      </Card>
      <EditUserModal user={user} open={open} onOpenChange={handleOpen} />
    </>
  );
};

export { UsersAdminList };
