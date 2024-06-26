import React from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { QUERY_KEYS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/routes/__root";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { updateUser } from "@/lib/queries";
import { UserType, UpdatingUser } from "@/lib/types";

const EditUserModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}> = ({ open, onOpenChange, user }) => {
  const [updatedUser, setUpdatedUser] = React.useState<UpdatingUser>({
    id: user?.id || "",
    username: user?.username || "",
    password: "",
    role: user?.role || "user",
  });

  React.useEffect(() => {
    setUpdatedUser({
      id: user?.id || "",
      username: user?.username || "",
      password: "",
      role: user?.role || "user",
    });
  }, [user]);

  const { mutateAsync } = useMutation({
    mutationFn: updateUser,
  });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser((prev) => ({ ...prev, username: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleRoleChange = (role: string) => {
    setUpdatedUser((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleUpdateUser = async () => {
    if (updatedUser.username === "") {
      toast.error("Username is required");
      return;
    }

    const mutate = mutateAsync(updatedUser, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USERS],
        });
      },
      onSuccess: () => {
        onOpenChange(false);
      },
    });

    toast.promise(mutate, {
      loading: "Updating...",
      success: "User updated successfully",
      error: "Failed to update user",
    });
  };

  console.log(updatedUser);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <h3>Edit User</h3>
          <DialogDescription>
            <div className="flex flex-col gap-4 mt-10">
              <Label>Username</Label>
              <Input
                onChange={handleUsernameChange}
                type="text"
                value={updatedUser.username}
              />
              <Label>Password</Label>
              <Input
                onChange={handlePasswordChange}
                type="password"
                value={updatedUser.password}
              />
              <Label>Role</Label>
              <Select onValueChange={handleRoleChange} value={updatedUser.role}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateUser}>Update</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { EditUserModal };
