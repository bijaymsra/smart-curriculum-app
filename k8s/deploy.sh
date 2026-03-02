#!/bin/bash

set -e

NAMESPACE="attenza"
MODEL="phi3"

echo "🚀 Starting Attenza Full Deployment..."

echo "🔎 Checking Kubernetes connection..."
kubectl cluster-info > /dev/null

echo "1️⃣ Applying Namespace..."
kubectl apply -f namespace.yaml

echo "2️⃣ Applying Secrets..."
kubectl apply -f mysql-secret.yaml

echo "3️⃣ Deploying MySQL..."
kubectl apply -f mysql.yaml

echo "⏳ Waiting for MySQL to be Ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n $NAMESPACE --timeout=300s

echo "4️⃣ Deploying Backend..."
kubectl apply -f backend.yaml

echo "⏳ Waiting for Backend..."
kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s

echo "5️⃣ Deploying Frontend..."
kubectl apply -f frontend.yaml

echo "⏳ Waiting for Frontend..."
kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s

echo "6️⃣ Deploying Ollama..."
kubectl apply -f ollama.yaml

echo "⏳ Waiting for Ollama..."
kubectl wait --for=condition=ready pod -l app=ollama -n $NAMESPACE --timeout=300s

echo "7️⃣ Ensuring LLM Model Exists..."

OLLAMA_POD=$(kubectl get pod -n $NAMESPACE -l app=ollama -o jsonpath="{.items[0].metadata.name}")

if kubectl exec -n $NAMESPACE $OLLAMA_POD -- ollama list | grep -q $MODEL; then
  echo "✅ Model $MODEL already exists."
else
  echo "⬇ Pulling model $MODEL (first time only)..."
  kubectl exec -n $NAMESPACE $OLLAMA_POD -- ollama pull $MODEL
fi

echo "8️⃣ Deploying AI Backend..."
kubectl apply -f ai-backend.yaml

echo "⏳ Waiting for AI Backend..."
kubectl wait --for=condition=ready pod -l app=ai-backend -n $NAMESPACE --timeout=300s

echo "9️⃣ Applying ClusterIssuer..."
kubectl apply -f cluster-issuer.yaml

echo "🔟 Applying Middleware..."
kubectl apply -f ai-middleware.yaml

echo "1️⃣1️⃣ Applying Ingress..."
kubectl apply -f ingress.yaml

echo "⏳ Waiting for TLS Certificate..."

for i in {1..30}; do
  STATUS=$(kubectl get certificate attenza-tls -n $NAMESPACE -o jsonpath="{.status.conditions[?(@.type=='Ready')].status}" 2>/dev/null || echo "False")
  if [ "$STATUS" == "True" ]; then
    echo "✅ TLS Certificate Issued Successfully!"
    break
  fi
  echo "⌛ Waiting for certificate..."
  sleep 10
done

echo "🧹 Cleaning old Completed/Failed Pods..."
kubectl delete pod -n $NAMESPACE --field-selector=status.phase=Succeeded 2>/dev/null || true
kubectl delete pod -n $NAMESPACE --field-selector=status.phase=Failed 2>/dev/null || true

echo ""
echo "🎉 Deployment Complete!"
echo "🌍 Access your app at:"
echo "👉 https://bijaymsra.site"
echo ""
kubectl get pods -n $NAMESPACE
