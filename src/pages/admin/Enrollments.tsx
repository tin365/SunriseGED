import AdminLayout from '../../layouts/AdminLayout';
import EnrollmentTable from '../../components/admin/EnrollmentTable';

export default function AdminEnrollments() {
  return (
    <AdminLayout title="Enrollments" description="Review student applications and update their status. Every change is recorded in the activity log.">
      <EnrollmentTable />
    </AdminLayout>
  );
}
