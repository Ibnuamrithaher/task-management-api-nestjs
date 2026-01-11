# Task Management API

## Requirements

- Node.js v20.19.6
- npm v10.8.2
- PostgreSQL 14

## Cara setup project

1. Buat database di PostgreSQL terlebih dahulu
2. Install dependencies:
   npm install

3. Buat file .env dari .env.example:
   cp .env.example .env

4. Konfigurasi database di file .env:
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=task_management
   JWT_SECRET=your_secret_key

## Schema Database

Aplikasi menggunakan **TypeORM** dengan `synchronize: true`, sehingga tabel akan dibuat otomatis saat aplikasi pertama kali dijalankan.

### Tabel `users`

| Kolom       | Tipe        | Keterangan             |
|------------|------------|-----------------------|
| `id`       | UUID       | Primary Key           |
| `name`     | VARCHAR    |                       |
| `email`    | VARCHAR    | Unique                |
| `password` | VARCHAR    |                       |
| `created_at` | TIMESTAMP |                       |
| `updated_at` | TIMESTAMP |                       |

### Tabel `tasks`

| Kolom         | Tipe         | Keterangan                       |
|---------------|-------------|---------------------------------|
| `id`          | UUID        | Primary Key                     |
| `title`       | VARCHAR     | NOT NULL                        |
| `description` | TEXT        | Nullable                        |
| `status`      | ENUM        | 'TODO', 'IN_PROGRESS', 'DONE'   |
| `user_id`     | UUID        | Foreign Key → `users.id`        |
| `created_at`  | TIMESTAMP   |                                 |
| `updated_at`  | TIMESTAMP   |                                 |


## Cara menjalankan aplikasi (tanpa Docker)

npm run start:dev

Aplikasi berjalan di http://localhost:3000

## Menjalankan dengan Docker (opsional)
docker-compose up --build
1. Pastikan sudah terinstall.
2. docker-compose up --build



## Contoh request API
Dokumentasi lengkap juga dapat dilihat langsung pada http://localhost:3000/docs saat aplikasi berjalan (Hanya untuk non docker)
### Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

### Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

### Create Task
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Task description"}'

### Get Tasks
curl -X GET "http://localhost:3000/tasks?page=1&limit=10" \
  -H "Authorization: Bearer <token>"

### Update Task
curl -X PATCH http://localhost:3000/tasks/<task_id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'

### Delete Task
curl -X DELETE http://localhost:3000/tasks/<task_id> \
  -H "Authorization: Bearer <token>"
