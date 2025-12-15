# Exam Docker - Counter App


## NOM ET PRENOM

SAIDI Soufiane

---

## Description
Cette application est un petit compteur avec une interface web (Node.js + Express) et une base de données PostgreSQL.  
Elle est containerisée avec Docker et orchestrée via Docker Compose.

L'application permet :
- d'incrémenter (+) ou décrémenter (-) le compteur
- de persister la valeur dans PostgreSQL (volume Docker)

---

## BEST PRACTICES

-- Multi stage build (separation du build et du runtime)

-- Séparation des services : Web app Node.js séparée de la BDD PostgreSQL

-- Volume pour la base de données

---

## Prérequis

- Port 3000 disponible

---

## Lancement de l'application

Depuis la racine du projet :

docker compose up --build

---

## Accès à la BDD

docker exec -it exam_saidi_soufiane-db-1 psql -U postgres -d counterdb

\dt   -- voir les tables

SELECT * FROM counter;  -- voir la valeur du compteur

---

## IMAGE ON REGISTRY:

docker login

--puis

docker push saidijr/exam-web:latest

--peut etre retrouver

https://hub.docker.com/r/saidijr/exam-web

--et pour pull

docker pull saidijr/exam-web

---

## SCAN and Report 

--pour le scan j'ai utiliser l'image aquasec/trivy et le rapport generé ce trouve dans le fichier trivy-report.txt

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image exam_saidi_soufiane-web

---



