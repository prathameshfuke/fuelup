# FuelTrack Pro - Deployment Guide

## 1. Supabase Setup for Backend

1.  **Create Project**: Go to [database.new](https://database.new) and create a new project.
2.  **Database Migration**:
    - Go to the **SQL Editor** in your Supabase dashboard.
    - Copy the contents of your SQL migration file (if you have one) or create the necessary tables manualy.
    - Enable **PostGIS** extension if doing geospatial queries:
      ```sql
      create extension postgis;
      ```
3.  **Authentication**:
    - Go to **Authentication** > **Providers**.
    - Enable **Google**.
    - You will need to set up a Google Cloud Project to get the `Client ID` and `Client Secret` and configure the callback URL to your Supabase project.
4.  **Storage**:
    - Go to **Storage**.
    - Create a new public bucket named `vehicle-photos`.
    - Create a private bucket named `receipts`.
5.  **Environment Variables**:
    - Go to **Project Settings** > **API**.
    - Copy the `Project URL` and `anon public key`.
    - You will need these for the next step.

## 2. Vercel Deployment

1.  **Import Project**:
    - Go to [vercel.com/new](https://vercel.com/new).
    - Import your GitHub repository.
2.  **Environment Variables**:
    - In the "Configure Project" step, expand the **Environment Variables** section.
    - Add the following variables:
        - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
        - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
        - `NEXT_PUBLIC_APP_URL`: The URL of your deployed app (e.g., `https://your-project.vercel.app`).
3.  **Deploy**:
    - Click **Deploy**.
    - Vercel will build and deploy your app.
4.  **Analytics**:
    - Once deployed, go to the **Analytics** tab in your Vercel project dashboard and enable it.

## 3. Local Development

1.  Create a `.env.local` file in the root directory.
2.  Add the same environment variables as above.
3.  Run `npm run dev`.
