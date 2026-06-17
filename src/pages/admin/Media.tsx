import AdminLayout from '../../layouts/AdminLayout';
import MediaUploader from '../../components/admin/MediaUploader';

export default function AdminMedia() {
  return (
    <AdminLayout title="Media" description="Upload photos and documents to R2 storage, or add YouTube videos to the gallery.">
      <MediaUploader />
    </AdminLayout>
  );
}
