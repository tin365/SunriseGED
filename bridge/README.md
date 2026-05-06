# Sunrise Printer / Scanner Bridge

This bridge runs on the admin computer, not on Cloudflare. It exposes a local-only endpoint at `http://localhost:7337` so the admin panel can check printer status and send print jobs to the computer's default printer.

## Setup

1. Install Node.js 20 or newer.
2. Open a terminal in the `bridge` folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and edit `SCAN_FOLDER`, `ADMIN_API_URL`, and `BRIDGE_TOKEN`.
5. Run `npm start`.

## macOS

Make sure the printer is installed in System Settings and is available to the `lpr` command. Scans should save into the folder configured by `SCAN_FOLDER`.

## Windows

Set a default printer in Windows Settings. If your printer needs a specific device name, set the `PRINTER` environment variable before starting the bridge.

## Scanner Uploads

The bridge watches the scan folder for new `.pdf`, `.jpg`, `.jpeg`, and `.png` files. New scans are uploaded to the Sunrise media API using `BRIDGE_TOKEN`.
