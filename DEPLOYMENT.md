# Spring Boot Stack Deployment Guide

This document outlines the steps to deploy the Spring Boot Notification Prioritization Engine to the cloud.

## 🚀 Live URLs
- **Frontend (Vercel)**: `[PENDING_DEPLOYMENT]`
- **Backend (Render)**: `[PENDING_DEPLOYMENT]`

## 🛠️ Deployment Configuration

### 1. Backend (Render)
- **Runtime**: Docker (Recommended for Spring Boot on Render)
- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -jar target/*.jar`
- **Environment Variables**:
  - `SPRING_DATASOURCE_URL`: Your Neon PostgreSQL connection string.
  - `SPRING_DATASOURCE_USERNAME`: Your database username.
  - `SPRING_DATASOURCE_PASSWORD`: Your database password.
  - `GROQ_API_KEY`: Your Groq API key.
  - `GROQ_MODEL`: `llama-3.3-70b-specdec`
  - `PORT`: 8082 (Render will override this automatically).

### 2. Frontend (Vercel)
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: The URL of your deployed Render backend (e.g., `https://your-java-app.onrender.com`).

## 🔑 Test Credentials
For reviewers, the login page displays these credentials directly:
- **Admin**: `admin@cyepro.com` / `admin123`
- **Operator**: `operator@cyepro.com` / `operator123`
