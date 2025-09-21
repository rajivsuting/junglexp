import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/page-container";
import UserForm from "@/features/users/components/user-form";
import { isSuperAdmin } from "@/lib/auth";

const NewUserPage = async () => {
  // Check if user has super admin access
  const hasAccess = await isSuperAdmin();

  if (!hasAccess) {
    redirect("/");
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <UserForm mode="create" />
      </div>
    </PageContainer>
  );
};

export default NewUserPage;
