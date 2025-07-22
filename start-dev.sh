#!/bin/bash

echo "Iniciando a API..."
(cd apps/api && npm run dev) &

echo "Iniciando o Admin Dashboard..."
(cd apps/admin-dashboard && npm run dev) &

echo "Iniciando o Widget FAB..."
(cd apps/widget-fab && npm run dev) &

echo "Todos os serviços estão sendo iniciados em segundo plano."
echo "Para parar, você pode precisar matar os processos npm ou node."
wait
