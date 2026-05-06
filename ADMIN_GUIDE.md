# Sunrise GED Admin Guide

## Login and 2FA

Go to `/admin/login`, enter your email and password, then enter the 6-digit authenticator code if 2FA is enabled. Set up 2FA from Settings after first login.

## Publish a Post

Open Admin → Posts. Enter titles and body text for English, Burmese, and Thai where available. Choose a type, set status to draft or published, and save. Published posts are returned by `/api/posts` and can appear on the public site.

## Review Enrollments

Open Admin → Enrollments. Filter by status or search by name. Use Approve, Reject, or Waitlist to update the application. Status updates are logged and can trigger email updates.

## Upload Media

Open Admin → Media. Upload photos and documents to R2 or add a YouTube URL. YouTube thumbnails use the public `img.youtube.com` URL and require no API key.

## Manage Users

Open Admin → Users. Super admins can invite users, change roles, disable accounts, and reset 2FA. Roles:

- `super_admin`: full access, including users and deletes
- `editor`: create and edit posts, enrollments, and media
- `viewer`: read-only admin access

## Printer / Scanner Bridge

Install the local bridge from `bridge/` on the admin computer. Keep it running while printing or auto-uploading scans. It listens only on `localhost:7337`.

## Email Templates

Templates live in `worker/lib/email.ts`:

- Enrollment received
- New enrollment alert
- Application status update
- Contact form confirmation
- Announcement broadcast

## Security Notes

Use strong passwords, enable 2FA, and never share API tokens. All secrets belong in Cloudflare secrets, not in source files.
