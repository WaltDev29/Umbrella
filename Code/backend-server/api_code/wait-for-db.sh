HOST=$DB_HOST
PORT=3306

echo "Waiting for $HOST:$PORT to be ready..."

for i in $(seq 1 30); do
  nc -z $HOST $PORT
  if [ $? -eq 0 ]; then
    echo "DB is ready! Starting server..."
    exec node server.js
    exit 0
  fi
  echo "Waiting ($i/30)..."
  sleep 1
done

echo "Error: DB not ready within 30 seconds."
exit 1