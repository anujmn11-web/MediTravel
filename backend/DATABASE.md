# MediTravel Database Documentation

MediTravel uses **PostgreSQL** as its production database and **SQLAlchemy 2.0** as the Object-Relational Mapper (ORM).

For local development convenience, the backend also supports **SQLite** as a fallback.

---

## Configuration

Environment variables are managed using a `.env` file in the `/backend` directory.

Copy the example file to get started:
```powershell
Copy-Item .env.example .env
```

### PostgreSQL Connection (Recommended)
Edit the `DATABASE_URL` in `.env` to match your Postgres configuration:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
```

### SQLite Connection (Fallback)
If you do not have PostgreSQL installed locally, you can use SQLite:
```env
DATABASE_URL=sqlite:///meditravel.db
```

---

## Alembic Migrations

Database schema changes are managed via Alembic.

### Running Migrations
To apply all migrations to the configured database, run:
```bash
venv\Scripts\alembic.exe upgrade head
```

### Generating New Migrations
If you modify any SQLAlchemy models under `app/models/`, generate a new migration revision using:
```bash
venv\Scripts\alembic.exe revision --autogenerate -m "Describe your changes"
```

---

## Seeding Data

To populate the database with Indian locations (all states + major cities) and mock hospitals and doctors, run:
```bash
venv\Scripts\python.exe -m app.database.seed
```
*Note: Make sure your terminal's current working directory is `/backend` and your virtual environment is active before running.*
