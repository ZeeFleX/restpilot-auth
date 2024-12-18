#!/bin/bash

# Extract components from DATABASE_URL
# Format: mysql://user:password@host:port/database
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Remove mysql:// prefix and split into authentication and database parts
DB_URL=${DATABASE_URL#mysql://}
AUTH_HOST=${DB_URL%/*}
DB_NAME=${DB_URL##*/}

# Split authentication and host
USER_PASS=${AUTH_HOST%@*}
HOST_PORT=${AUTH_HOST#*@}

# Split user and password
DB_USER=${USER_PASS%:*}
DB_PASS=${USER_PASS#*:}

# Split host and port
DB_HOST=${HOST_PORT%:*}
DB_PORT=${HOST_PORT#*:}

# Execute mysql command with parsed parameters and UTF-8 settings
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
  --default-character-set=utf8mb4 \
  --init-command="SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;" \
  < ./prisma/seed.sql
