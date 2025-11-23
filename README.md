# demo-storage
postgres - statefullset + pvc - rest API

# Demo storage stack (Helm + PostgreSQL + notes-app)

Tento projekt nasadí PostgreSQL databázu (StatefulSet + PV/PVC + Secret) a notes-app (Node.js API) napojenú na PostgreSQL, všetko cez jeden Helm chart s dvoma subchartami (postgres, notes-app). Namespace: demo-storage, Helm release: demo-storage. Predpoklady: Kubernetes cluster (napr. microk8s), kubectl, Helm 3, Docker image pre notes-app v registry (ghcr.io/johno221/notes-app:latest). Štruktúra: parent Helm chart + subcharty.

Inštalácia stacku cez Helm:
cd ~/demo-storage/helm/demo-storage
helm install demo-storage . -n demo-storage --create-namespace

Upgrade:
helm upgrade demo-storage . -n demo-storage

Port-forward aplikácie:
kubectl -n demo-storage port-forward deploy/notes-app 8080:8080

Health check:
curl http://localhost:8080/health
Očakávaná odpoveď: {"status":"ok","db":"ok"}

Vytvorenie poznámky:
curl -X POST http://localhost:8080/notes -H "Content-Type: application/json" -d '{"text":"Poznamka cez Helm deployment"}'

Zobrazenie poznámok:
curl http://localhost:8080/notes

Kontrola storage:
kubectl -n demo-storage get pvc
kubectl get pv

Dáta sú uložené v:
/home/jbl/demo-storage/pgdata

Test persistencie:
1. Pridať poznámku
2. Zmazať PostgreSQL pod: kubectl -n demo-storage delete pod postgres-0
3. Po štarte podu znova zavolať: curl http://localhost:8080/notes
Dáta musia zostať zachované.
