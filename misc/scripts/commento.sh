cd /Users/moizik/nosparrow/commento
make devel
cd -
export COMMENTO_ORIGIN=http://localhost:8080
export COMMENTO_PORT=8080
export COMMENTO_POSTGRES=postgres://postgres:postgres@localhost:5432/commento?sslmode=disable
/Users/moizik/nosparrow/commento/build/devel/commento

