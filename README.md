# Secret Service

> You must have Docker installed!

## Start Database

```bash
docker-compose up -d
```

## Install Deps

```bash
npm install
```

## Start Server

```bash
NODE_ENV=production node index.js
```

## Erase Database

```bash
docker-compose down --volumes
```
