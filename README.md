# ATLAS: Cloud-Native Automated Tracking & Learning Assistant System

A Production-Ready, Cloud-Native Automated Tracking & Learning Assistant System  
with Integrated AI Assistant powered by Local LLM (Ollama)

---

# Live Architecture Overview

Automated Tracking & Learning Assistant System - ATLAS is a fully containerized, Kubernetes-orchestrated full-stack platform designed for educational institutions.

It includes:

- 🌐 React Frontend (Nginx)
- ☕ Spring Boot Backend (Java 17)
- 🧠 Python AI Backend (LLM Gateway)
- 🤖 Ollama (Local LLM Runtime - phi3 model)
- 🗄 MySQL Database
- ☸ Kubernetes (K3s / K8s Cluster)
- 📈 Horizontal Pod Autoscaler (HPA)
- 🔐 HTTPS via cert-manager (Let's Encrypt)
- 🚦 Traefik Ingress Controller
- 🧾 Automated Deployment Script
- 🌍 Custom Domain + Elastic IP (AWS)

---

# System Architecture

```
User
  │
  ▼
🌐 Domain (Elastic IP → EC2)
  │
  ▼
🚦 Traefik Ingress
  │
  ├── /        → React Frontend (Nginx)
  ├── /api     → Spring Boot Backend
  └── /ai      → Python AI Backend
                     │
                     ▼
                🤖 Ollama (phi3 LLM)
```

---

# Core Functional Modules

## 1️ Landing Page
- Public entry page
- Login & Signup

## 2️ Authentication System
Roles:
- 👑 Admin
- 👨‍🏫 Faculty
- 🎓 Student

## 3️ Institution Signup
- Institution registers
- Admin account created

## 4️ Admin Dashboard
- Manage Students
- Manage Faculty
- Create Classes
- Control Attendance
- View Full Analytics

## 5️ Faculty Dashboard
- Start Attendance Sessions
- Live Student Monitoring
- View Analytics
- Attendance Insights

## 6️ Student Dashboard
- Join Classes
- Scan Dynamic QR Code
- View Attendance Records
- Personal Analytics
- 🤖 AI Assistant for help & academic queries

---

# AI Architecture

AI backend is isolated as a microservice.

Flow:

Student → React → `/ai` → Python Backend → Ollama → phi3 Model → Response

Environment Variables:

- `OLLAMA_URL=http://ollama:11434/api/chat`
- `MODEL_NAME=phi3`

Model is auto-pulled during deployment if not present.

---

# Project Structure

```
smart-curriculum-app/
│
├── backend/          # Spring Boot Application
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│
├── frontend/         # React + Tailwind + Nginx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│
├── k8s/              # Kubernetes Manifests
│   ├── namespace.yaml
│   ├── mysql.yaml
│   ├── mysql-secret.example.yaml
│   ├── backend.yaml
│   ├── backend-hpa.yaml
│   ├── frontend.yaml
│   ├── ai-backend.yaml
│   ├── ollama.yaml
│   ├── ingress.yaml
│   ├── cluster-issuer.yaml
│   ├── ai-middleware.yaml
│   ├── deploy.sh
│
├── diagrams/              
│   ├── architecture.png
│   ├── er-diagram.png
|   ├── hpa.png
|   ├── deployment_architecture.png
|   ├── workflow.png
|
└── README.md
```

---

# Docker Architecture

## Backend (Spring Boot)
- Multi-stage build (Maven → Temurin 17)
- Exposes port 8080
- Uses readiness & liveness probes

## Frontend (React)
- Node build stage
- Served via Nginx
- Production static build

## AI Backend
- Python container
- Connects internally to Ollama

---

# Kubernetes Features

- Namespace Isolation
- Rolling Updates
- Resource Requests & Limits
- Liveness & Readiness Probes
- Horizontal Pod Autoscaler
- TLS Certificates (cert-manager)
- Ingress Routing (Traefik)
- Middleware Path Stripping
- Automated Deployment Script

---

# Horizontal Scaling

Backend HPA Configuration:

- Min Replicas: 1
- Max Replicas: 8
- CPU Target: 65%
- Memory Target: 75%

Automatic scaling based on load.

---

# Security Practices

- Secrets excluded from Git
- `mysql-secret.example.yaml` provided
- TLS via Let's Encrypt
- Ingress routing with HTTPS
- Resource constraints enforced

---

# AWS EC2 Infrastructure

Minimum Recommended Instance:

- OS: Ubuntu 22.04
- Instance Type: m7i-flex.large
- CPU: 2 vCPU
- RAM: 8GB
- Storage: 30GB
- Elastic IP attached
- Security Group:
  - SSH (22)
  - HTTP (80)
  - HTTPS (443)
  - Required TCP Ports

---

# Domain Setup

1. Allocate Elastic IP
2. Associate with EC2 instance
3. Point domain A-record to Elastic IP
4. Deploy Ingress with TLS
5. cert-manager issues certificate automatically

---

# Full Deployment Guide

## 1️ Install Dependencies on EC2

- Docker
- kubectl
- K3s or Kubernetes
- Helm (optional)

## 2️ Clone Repository

```
git clone <your-repo-url>
cd smart-curriculum-app/k8s
```

## 3️ Create Secret File

```
cp mysql-secret.example.yaml mysql-secret.yaml
```

Update credentials manually.

## 4️ Run Automated Deployment

```
chmod +x deploy.sh
./deploy.sh
```

Deployment Steps:

1. Namespace
2. Secrets
3. MySQL
4. Backend
5. Frontend
6. Ollama
7. LLM Model Pull
8. AI Backend
9. ClusterIssuer
10. Middleware
11. Ingress
12. TLS Validation

---

# CI/CD Ready

This architecture supports:

- GitHub Actions
- Docker Hub Auto Builds
- Kubernetes Rolling Updates
- Zero Downtime Deployments

---

# Monitoring Ready

Includes:

- ServiceMonitor
- Prometheus Compatible Labels
- Health Endpoints (`/actuator/health`)

---

# Why This Project Is Production-Grade

- Microservice Architecture
- Infrastructure as Code
- Kubernetes Native
- Secure Secret Management
- Auto Scaling
- TLS Automation
- Domain Routing
- AI Integration
- Clean DevOps Structure

---

# Future Improvements

- Redis Caching
- CI/CD Pipelines
- Observability Stack (Prometheus + Grafana)
- Role-Based JWT Enhancements
- Multi-Tenant Institution Isolation
- Model Switching Support

---

# Author

Built & Architected by Bijay Mishra

Cloud | DevOps | AI Systems | Kubernetes | Full-Stack Engineering

---

# License

MIT License

---

# Final Note

This project demonstrates:

✔ Full-Stack Engineering  
✔ Cloud Infrastructure Design  
✔ DevOps Automation  
✔ AI System Integration  
✔ Production Deployment Strategy  

Designed as a real-world, scalable, cloud-native academic platform.
