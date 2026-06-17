import AdminLayout from '../../layouts/AdminLayout';
import PostEditor from '../../components/admin/PostEditor';

export default function AdminPosts() {
  return (
    <AdminLayout title="Posts" description="Create multilingual news, activities, announcements, and achievements. Published posts appear on the public site.">
      <PostEditor />
    </AdminLayout>
  );
}
