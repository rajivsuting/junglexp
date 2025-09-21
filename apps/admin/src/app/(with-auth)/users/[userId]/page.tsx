import { notFound, redirect } from 'next/navigation';

import PageContainer from '@/components/layout/page-container';
import UserForm from '@/features/users/components/user-form';
import { isSuperAdmin } from '@/lib/auth';
import { getUserById } from '@repo/actions/users.actions';

interface EditUserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  // Check if user has super admin access
  const hasAccess = await isSuperAdmin();

  const { userId } = await params;

  if (!hasAccess || !userId) {
    redirect("/");
  }

  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4 flex-1">
        <UserForm user={user} mode="edit" />
      </div>
    </PageContainer>
  );
};

export default EditUserPage;
