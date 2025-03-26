# Detaillierte Anleitung zum Hosten der Film- und Serienempfehlungsapp

Diese Anleitung führt Sie durch den Prozess, die Film- und Serienempfehlungsapp auf stabilen Plattformen zu hosten, damit Sie sie dauerhaft nutzen können. Wir werden die Versionskontrolle mit Git einrichten und die App auf kostenlosen Hosting-Plattformen bereitstellen.

## Inhaltsverzeichnis
1. [Einrichtung eines Git-Repositories](#1-einrichtung-eines-git-repositories)
2. [Deployment des Backends](#2-deployment-des-backends)
3. [Deployment des Frontends](#3-deployment-des-frontends)
4. [Konfiguration der Umgebungsvariablen](#4-konfiguration-der-umgebungsvariablen)
5. [Verbindung zwischen Frontend und Backend](#5-verbindung-zwischen-frontend-und-backend)
6. [Wartung und Updates](#6-wartung-und-updates)

## 1. Einrichtung eines Git-Repositories

Git ermöglicht die Versionskontrolle und erleichtert die Zusammenarbeit und das Deployment.

### 1.1 Git lokal einrichten

```bash
# Git installieren (falls noch nicht vorhanden)
sudo apt-get update
sudo apt-get install git

# Ins Projektverzeichnis wechseln
cd /home/ubuntu/film-recommendation-app

# Git-Repository initialisieren
git init

# Git-Benutzer konfigurieren
git config --global user.name "Ihr Name"
git config --global user.email "ihre.email@beispiel.com"

# .gitignore-Datei erstellen
echo "node_modules/
.env
build/
dist/
.DS_Store
npm-debug.log
.vscode/" > .gitignore

# Dateien zum Repository hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Initiales Commit der Film- und Serienempfehlungsapp"
```

### 1.2 GitHub-Repository erstellen

1. Besuchen Sie [GitHub](https://github.com) und melden Sie sich an (oder erstellen Sie ein Konto)
2. Klicken Sie auf "New" (Neu), um ein neues Repository zu erstellen
3. Geben Sie einen Namen ein (z.B. "film-recommendation-app")
4. Lassen Sie die Option "Initialize this repository with a README" deaktiviert
5. Klicken Sie auf "Create repository" (Repository erstellen)

### 1.3 Lokales Repository mit GitHub verbinden

```bash
# Remote-Repository hinzufügen (ersetzen Sie USERNAME durch Ihren GitHub-Benutzernamen)
git remote add origin https://github.com/USERNAME/film-recommendation-app.git

# Lokales Repository auf GitHub pushen
git push -u origin master
```

## 2. Deployment des Backends

Wir werden das Backend auf [Render](https://render.com) hosten, da es einen kostenlosen Plan für Web-Services anbietet.

### 2.1 Vorbereitung des Backends für das Deployment

```bash
# Ins Backend-Verzeichnis wechseln
cd /home/ubuntu/film-recommendation-app/backend

# Procfile für Render erstellen
echo "web: node server.js" > Procfile

# package.json anpassen, um Node.js-Version anzugeben
# Öffnen Sie package.json und fügen Sie folgendes hinzu:
```

Fügen Sie in der `package.json`-Datei folgende Zeilen hinzu:

```json
"engines": {
  "node": ">=14.0.0"
},
"scripts": {
  "start": "node server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

### 2.2 Render-Konto erstellen und Backend deployen

1. Besuchen Sie [Render](https://render.com) und erstellen Sie ein Konto
2. Verbinden Sie Ihr GitHub-Konto mit Render
3. Klicken Sie auf "New" (Neu) und wählen Sie "Web Service"
4. Wählen Sie Ihr GitHub-Repository aus
5. Konfigurieren Sie den Service:
   - Name: film-recommendation-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Branch: main (oder master)
   - Root Directory: backend (wichtig!)
6. Wählen Sie den kostenlosen Plan
7. Klicken Sie auf "Create Web Service" (Web-Service erstellen)

## 3. Deployment des Frontends

Wir werden das Frontend auf [Vercel](https://vercel.com) hosten, da es optimal für React-Anwendungen ist.

### 3.1 Vorbereitung des Frontends für das Deployment

```bash
# Ins Frontend-Verzeichnis wechseln
cd /home/ubuntu/film-recommendation-app/frontend

# vercel.json-Datei erstellen
echo '{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}' > vercel.json
```

### 3.2 Vercel-Konto erstellen und Frontend deployen

1. Besuchen Sie [Vercel](https://vercel.com) und erstellen Sie ein Konto
2. Verbinden Sie Ihr GitHub-Konto mit Vercel
3. Klicken Sie auf "Import Project" (Projekt importieren)
4. Wählen Sie "Import Git Repository" (Git-Repository importieren)
5. Wählen Sie Ihr GitHub-Repository aus
6. Konfigurieren Sie das Projekt:
   - Framework Preset: Create React App
   - Root Directory: frontend (wichtig!)
7. Klicken Sie auf "Deploy" (Bereitstellen)

## 4. Konfiguration der Umgebungsvariablen

Umgebungsvariablen sind wichtig für die Sicherheit und Flexibilität der App.

### 4.1 Backend-Umgebungsvariablen auf Render

1. Gehen Sie zu Ihrem Backend-Service auf Render
2. Klicken Sie auf "Environment" (Umgebung)
3. Fügen Sie folgende Umgebungsvariablen hinzu:
   - `TMDB_API_KEY`: 923f629e9e2cca64abdc0bf7c59f61f2
   - `OPENAI_API_KEY`: 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
   - `PORT`: 8080 (Render verwendet diesen Port standardmäßig)
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: https://ihre-frontend-url.vercel.app (ersetzen Sie dies mit Ihrer tatsächlichen Frontend-URL)

4. Klicken Sie auf "Save Changes" (Änderungen speichern)
5. Starten Sie den Service neu, damit die Änderungen wirksam werden

### 4.2 Frontend-Umgebungsvariablen auf Vercel

1. Gehen Sie zu Ihrem Frontend-Projekt auf Vercel
2. Klicken Sie auf "Settings" (Einstellungen) und dann auf "Environment Variables" (Umgebungsvariablen)
3. Fügen Sie folgende Umgebungsvariable hinzu:
   - `REACT_APP_API_URL`: https://ihre-backend-url.onrender.com (ersetzen Sie dies mit Ihrer tatsächlichen Backend-URL)
4. Klicken Sie auf "Save" (Speichern)
5. Gehen Sie zu "Deployments" (Bereitstellungen) und klicken Sie auf "Redeploy" (Erneut bereitstellen)

## 5. Verbindung zwischen Frontend und Backend

Um sicherzustellen, dass das Frontend mit dem Backend kommunizieren kann, müssen wir die API-URL im Frontend anpassen.

### 5.1 API-Konfiguration im Frontend

Bearbeiten Sie die Datei `/home/ubuntu/film-recommendation-app/frontend/src/api/api.ts`:

```typescript
// Dynamische API-URL basierend auf der Umgebung
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

// API-Client für Backend-Anfragen
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Committen und pushen Sie diese Änderungen:

```bash
git add frontend/src/api/api.ts
git commit -m "API-URL für Produktion angepasst"
git push
```

Vercel wird automatisch ein neues Deployment starten, wenn Sie Änderungen pushen.

## 6. Wartung und Updates

### 6.1 Lokale Entwicklung

Für die weitere Entwicklung können Sie lokal arbeiten:

```bash
# Backend starten
cd /home/ubuntu/film-recommendation-app/backend
npm start

# Frontend in einem anderen Terminal starten
cd /home/ubuntu/film-recommendation-app/frontend
npm start
```

### 6.2 Updates deployen

Wenn Sie Änderungen vornehmen, können Sie diese einfach deployen:

```bash
# Änderungen committen
git add .
git commit -m "Beschreibung der Änderungen"

# Änderungen auf GitHub pushen
git push
```

Sowohl Vercel als auch Render werden automatisch neue Deployments starten, wenn Sie Änderungen pushen.

### 6.3 Logs und Debugging

- **Render**: Gehen Sie zu Ihrem Service und klicken Sie auf "Logs" (Protokolle)
- **Vercel**: Gehen Sie zu Ihrem Projekt und klicken Sie auf "Deployments" (Bereitstellungen) > [Deployment] > "Functions Logs" (Funktionsprotokolle)

## Zusammenfassung

Sie haben nun erfolgreich:
1. Ein Git-Repository für die Versionskontrolle eingerichtet
2. Das Backend auf Render deployed
3. Das Frontend auf Vercel deployed
4. Die Umgebungsvariablen konfiguriert
5. Die Verbindung zwischen Frontend und Backend hergestellt

Ihre Film- und Serienempfehlungsapp ist jetzt öffentlich zugänglich und kann von überall aus verwendet werden. Die KI-Empfehlungsfunktion sollte mit dem konfigurierten OpenAI API-Schlüssel funktionieren.

Wenn Sie Fragen haben oder auf Probleme stoßen, können Sie die Dokumentation der jeweiligen Plattformen konsultieren oder mich um weitere Unterstützung bitten.
