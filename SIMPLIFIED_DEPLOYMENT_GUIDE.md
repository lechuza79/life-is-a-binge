# "Life is a Binge" - Vereinfachte Anleitung zum Hosten der App

Diese benutzerfreundliche Anleitung führt Sie durch den Prozess, Ihre "Life is a Binge" Film- und Serienempfehlungsapp auf stabilen Plattformen zu hosten, ohne dass Sie tiefe Programmierkenntnisse benötigen.

## Inhaltsverzeichnis
1. [Einrichtung mit GitHub Desktop](#1-einrichtung-mit-github-desktop)
2. [Deployment des Backends auf Render](#2-deployment-des-backends-auf-render)
3. [Deployment des Frontends auf Vercel](#3-deployment-des-frontends-auf-vercel)
4. [Konfiguration der Umgebungsvariablen](#4-konfiguration-der-umgebungsvariablen)
5. [Wartung und Updates](#5-wartung-und-updates)

## 1. Einrichtung mit GitHub Desktop

GitHub Desktop ist eine benutzerfreundliche Anwendung, die Ihnen hilft, Ihre App zu verwalten und zu aktualisieren.

### 1.1 GitHub Desktop installieren und einrichten

1. Laden Sie [GitHub Desktop](https://desktop.github.com/) herunter und installieren Sie es
2. Öffnen Sie GitHub Desktop und melden Sie sich mit Ihrem GitHub-Konto an
   - Falls Sie noch kein Konto haben, können Sie auf [GitHub](https://github.com) eines erstellen
3. Klicken Sie auf "File" > "Clone Repository" > "URL"
4. Geben Sie die URL Ihres Projektverzeichnisses ein (falls Sie bereits ein Repository haben)
   - Alternativ können Sie "File" > "Add Local Repository" wählen und Ihr lokales Projektverzeichnis auswählen

### 1.2 GitHub-Repository erstellen

1. Öffnen Sie GitHub Desktop
2. Klicken Sie auf "File" > "New Repository"
3. Füllen Sie die Felder aus:
   - Name: life-is-a-binge
   - Beschreibung: Film- und Serienempfehlungsapp
   - Lokaler Pfad: Wählen Sie den Pfad zu Ihrem Projektordner
   - Lassen Sie "Initialize this repository with a README" aktiviert
4. Klicken Sie auf "Create Repository"

### 1.3 Projektdateien hinzufügen

1. Kopieren Sie alle Dateien aus dem Projektordner in den neuen Repository-Ordner
2. In GitHub Desktop werden die neuen Dateien automatisch erkannt
3. Geben Sie eine Zusammenfassung ein, z.B. "Initiales Commit für Life is a Binge"
4. Klicken Sie auf "Commit to main"
5. Klicken Sie auf "Publish repository" (oder "Push origin", falls das Repository bereits veröffentlicht wurde)

## 2. Deployment des Backends auf Render

Render ist eine benutzerfreundliche Plattform, die das Hosten Ihrer App vereinfacht.

### 2.1 Vorbereitung des Backends

1. Öffnen Sie den Ordner "backend" in Ihrem Projektverzeichnis
2. Erstellen Sie eine neue Datei namens "Procfile" (ohne Dateiendung) mit folgendem Inhalt:
   ```
   web: node server.js
   ```
3. Öffnen Sie die Datei "package.json" und stellen Sie sicher, dass sie folgende Zeilen enthält:
   ```json
   "engines": {
     "node": ">=14.0.0"
   },
   "scripts": {
     "start": "node server.js",
     "test": "echo \"Error: no test specified\" && exit 1"
   }
   ```
4. Speichern Sie die Änderungen
5. In GitHub Desktop:
   - Geben Sie eine Zusammenfassung ein, z.B. "Backend für Deployment vorbereitet"
   - Klicken Sie auf "Commit to main"
   - Klicken Sie auf "Push origin"

### 2.2 Render-Konto erstellen und Backend deployen

1. Besuchen Sie [Render](https://render.com) und erstellen Sie ein Konto
2. Klicken Sie auf "New" und wählen Sie "Web Service"
3. Klicken Sie auf "Build and deploy from a Git repository"
4. Verbinden Sie Ihr GitHub-Konto mit Render, wenn Sie dazu aufgefordert werden
5. Wählen Sie Ihr "life-is-a-binge" Repository aus
6. Konfigurieren Sie den Service:
   - Name: life-is-a-binge-backend
   - Region: Wählen Sie die Region, die Ihnen am nächsten ist
   - Branch: main
   - Root Directory: backend
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
7. Wählen Sie den kostenlosen Plan ("Free")
8. Klicken Sie auf "Create Web Service"

## 3. Deployment des Frontends auf Vercel

Vercel ist eine benutzerfreundliche Plattform, die speziell für Frontend-Anwendungen optimiert ist.

### 3.1 Vorbereitung des Frontends

1. Öffnen Sie den Ordner "frontend" in Ihrem Projektverzeichnis
2. Erstellen Sie eine neue Datei namens "vercel.json" mit folgendem Inhalt:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
3. Speichern Sie die Änderungen
4. In GitHub Desktop:
   - Geben Sie eine Zusammenfassung ein, z.B. "Frontend für Deployment vorbereitet"
   - Klicken Sie auf "Commit to main"
   - Klicken Sie auf "Push origin"

### 3.2 Vercel-Konto erstellen und Frontend deployen

1. Besuchen Sie [Vercel](https://vercel.com) und erstellen Sie ein Konto
2. Klicken Sie auf "Add New..." > "Project"
3. Verbinden Sie Ihr GitHub-Konto mit Vercel, wenn Sie dazu aufgefordert werden
4. Wählen Sie Ihr "life-is-a-binge" Repository aus
5. Konfigurieren Sie das Projekt:
   - Framework Preset: Create React App
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: build
6. Klicken Sie auf "Deploy"

## 4. Konfiguration der Umgebungsvariablen

Umgebungsvariablen sind wichtig für die Sicherheit und Funktionalität Ihrer App.

### 4.1 Backend-Umgebungsvariablen auf Render

1. Gehen Sie zu Ihrem Backend-Service auf Render
2. Klicken Sie auf "Environment" in der linken Seitenleiste
3. Fügen Sie folgende Umgebungsvariablen hinzu:
   - `TMDB_API_KEY`: 923f629e9e2cca64abdc0bf7c59f61f2
   - `OPENAI_API_KEY`: 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
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: https://life-is-a-binge.vercel.app (oder Ihre tatsächliche Frontend-URL)
4. Klicken Sie auf "Save Changes"
5. Klicken Sie auf "Manual Deploy" > "Clear build cache & deploy"

### 4.2 Frontend-Umgebungsvariablen auf Vercel

1. Gehen Sie zu Ihrem Frontend-Projekt auf Vercel
2. Klicken Sie auf "Settings" > "Environment Variables"
3. Fügen Sie folgende Umgebungsvariable hinzu:
   - Name: `REACT_APP_API_URL`
   - Value: https://life-is-a-binge-backend.onrender.com (oder Ihre tatsächliche Backend-URL)
4. Klicken Sie auf "Save"
5. Gehen Sie zu "Deployments" und klicken Sie auf "Redeploy"

### 4.3 Anpassung des App-Namens

Um den Namen der App auf "Life is a Binge" zu ändern:

1. Öffnen Sie die Datei `frontend/public/index.html` und ändern Sie den Titel:
   ```html
   <title>Life is a Binge</title>
   ```
2. Öffnen Sie die Datei `frontend/src/components/Header.tsx` und ändern Sie den Namen:
   ```jsx
   <Typography
     variant="h6"
     component="div"
     sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
     onClick={() => navigate('/')}
   >
     Life is a Binge
   </Typography>
   ```
3. Speichern Sie die Änderungen
4. In GitHub Desktop:
   - Geben Sie eine Zusammenfassung ein, z.B. "App-Name auf 'Life is a Binge' geändert"
   - Klicken Sie auf "Commit to main"
   - Klicken Sie auf "Push origin"
5. Vercel wird automatisch ein neues Deployment starten

## 5. Wartung und Updates

### 5.1 Änderungen vornehmen

Wenn Sie Änderungen an Ihrer App vornehmen möchten:

1. Bearbeiten Sie die gewünschten Dateien in Ihrem Projektordner
2. In GitHub Desktop:
   - Überprüfen Sie die Änderungen
   - Geben Sie eine Zusammenfassung ein, die beschreibt, was Sie geändert haben
   - Klicken Sie auf "Commit to main"
   - Klicken Sie auf "Push origin"
3. Vercel und Render werden automatisch neue Deployments starten

### 5.2 Überwachung Ihrer App

- **Render**: Gehen Sie zu Ihrem Service und klicken Sie auf "Logs", um Probleme zu identifizieren
- **Vercel**: Gehen Sie zu Ihrem Projekt und klicken Sie auf "Deployments" > [Deployment] > "Functions Logs"

## Zusammenfassung

Sie haben nun erfolgreich:
1. Ein GitHub-Repository mit GitHub Desktop eingerichtet
2. Das Backend auf Render deployed
3. Das Frontend auf Vercel deployed
4. Die Umgebungsvariablen konfiguriert
5. Den App-Namen auf "Life is a Binge" geändert

Ihre "Life is a Binge" Film- und Serienempfehlungsapp ist jetzt öffentlich zugänglich und kann von überall aus verwendet werden. Die KI-Empfehlungsfunktion sollte mit dem konfigurierten OpenAI API-Schlüssel funktionieren.

Wenn Sie Fragen haben oder auf Probleme stoßen, können Sie die Dokumentation der jeweiligen Plattformen konsultieren oder mich um weitere Unterstützung bitten.
