# demo-storage
postgres - statefullset + pvc - rest API 

Architektúra

Namespace: demo-storage

DB: PostgreSQL (StatefulSet + PVC)

Appka: jednoduché REST API (môže byť hocijaký existujúci Docker image, aj demo)
– napr. “notes-service” alebo “todo-service”

Storage:

verzia A: statický PV + PVC (hostPath – iba na lokálne hranie)

verzia B: dynamic provisioning cez StorageClass
