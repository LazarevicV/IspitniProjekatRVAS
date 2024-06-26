import React from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
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
import { createUser } from "@/lib/queries";
import { CreatingUser, UserType } from "@/lib/types";

const AddUserModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const [createdUser, setCreatedUser] = React.useState<CreatingUser>({
    username: "",
    password: "",
    role: "user",
  });

  const { mutateAsync } = useMutation({
    mutationFn: createUser,
  });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedUser((prev) => ({ ...prev, username: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreatedUser((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleRoleChange = (role: string) => {
    setCreatedUser((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleCreateUser = async () => {
    if (createdUser.username === "" || createdUser.password === "") {
      toast.error("Username and password are required");
      return;
    }

    const mutate = mutateAsync(createdUser, {
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
      loading: "Adding...",
      success: "User created successfully",
      error: "Failed to create user",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <h3>Add User</h3>
          <DialogDescription>
            <div className="flex flex-col gap-4 mt-10">
              <Label>Username</Label>
              <Input
                onChange={handleUsernameChange}
                type="text"
                value={createdUser.username}
              />
              <Label>Password</Label>
              <Input
                onChange={handlePasswordChange}
                type="password"
                value={createdUser.password}
              />
              <Label>Role</Label>
              <Select onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreateUser}>Create</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { AddUserModal };
