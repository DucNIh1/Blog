# Blog

### Prerequisites:
- Node JS (v20+)

### How to run
- Run docker compose file:
```bash
docker compose --env-file backend/.env up -d
```
```
account admin: admin@gmail.com password: N112233n
```
- Run backend service:
```bash
cd backend
npm install
npm run server
```

- Run client service:
```bash
cd client
npm install
npm run dev
```