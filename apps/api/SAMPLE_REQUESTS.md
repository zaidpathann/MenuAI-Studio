# MenuAI Studio API Sample Requests

Base URL:

```txt
http://localhost:4000
```

## Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@menuai.com\",\"password\":\"Zaid@6222\"}"
```

Use the returned token:

```txt
Authorization: Bearer YOUR_TOKEN
```

## Create Project

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"name\":\"Spring Menu Refresh\",\"restaurantName\":\"Aurum Table\"}"
```

## Get Projects

```bash
curl http://localhost:4000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Get Project By ID

```bash
curl http://localhost:4000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Upload PDF

```bash
curl -X POST http://localhost:4000/api/projects/PROJECT_ID/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@menu.pdf;type=application/pdf"
```

## Mock Extraction

```bash
curl -X POST http://localhost:4000/api/projects/PROJECT_ID/extract \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Generate 5 Designs

```bash
curl -X POST http://localhost:4000/api/projects/PROJECT_ID/generate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Save Design Canvas

```bash
curl -X PATCH http://localhost:4000/api/designs/DESIGN_ID/canvas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"canvasState\":{\"version\":1,\"elements\":[]}}"
```

## Publish Design

```bash
curl -X POST http://localhost:4000/api/designs/DESIGN_ID/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Generate Client Key

```bash
curl -X POST http://localhost:4000/api/access/keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"projectId\":\"PROJECT_ID\"}"
```

Response key format:

```txt
MENU-XXXX-XXXX
```

## Verify Client Key

```bash
curl -X POST http://localhost:4000/api/access/verify \
  -H "Content-Type: application/json" \
  -d "{\"accessKey\":\"MENU-XXXX-XXXX\"}"
```
