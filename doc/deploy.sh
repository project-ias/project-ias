cd ~/project-ias
git stash
git pull origin master

cd ~/project-ias/backend
yarn

sudo service nginx restart
pm2 restart all