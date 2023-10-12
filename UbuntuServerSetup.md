# Setting up an Ubuntu 22.04 Server

## Table of Contents
1. [Adding a new admin User](#new-user)
2. [Downloading an uptodate version of NodeJS](#nodejs)
3. [Installing PostgreSQL](#postgresql)
4. [Installing PM2](#pm2)
5. [Seting up the PM2](#pm2-config)
6. [Reroutung port 80 to 3000](#port-80-to-3000)

## Adding a new admin User <a name="new-user"></a>
1. Log in as root
2. Create a new user
```bash
adduser <username>
```
3. Add the user to the sudo group
```bash
usermod -aG sudo <username>
```
4. Switch to the new user
```bash
su - <username>
```

## Downloading an uptodate version of NodeJS <a name="nodejs"></a>

1. Download and import the Nodesource GPG key
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
```
2. Add the Nodesource repository
```bash
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```
3. Run Update and Install
```bash
sudo apt-get update
sudo apt-get install nodejs -y
```
4. Install NodeJS v20
```bash
sudo yum install https://rpm.nodesource.com/pub_20.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y
sudo yum install nodejs -y --setopt=nodesource-nodejs.module_hotfixes=1
```

## Installing PostgreSQL <a name="postgresql"></a>
Not currently needed

## Installing PM2 <a name="pm2"></a>
1. Install PM2
```bash
sudo npm install pm2@latest -g
```
2. Start PM2 on boot
```bash
pm2 startup systemd
```

## Seting up PM2 <a name="pm2-config"></a>
1. Create a new PM2 config file
```bash
pm2 ecosystem
```
2. Edit the ecosystem.config.js file
```bash
nano ecosystem.config.js
```
3. Add the following to the file
```js
module.exports = {
  apps : [{
    name: 'Plapy',
    script: 'index.js',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```
4. Save and exit the file
5. Start the app
```bash
pm2 start ecosystem.config.js
```
6. Save the PM2 config
```bash
pm2 save
```

## Reroutung port 80 to 3000 <a name="port-80-to-3000"></a>
1. Install NGINX
```bash
sudo apt install nginx -y
```
2. Edit the NGINX config file
```bash
sudo nano /etc/nginx/sites-available/default
```
3. Add the following to the file
```nginx
server {
    listen 80;
    server_name <domain>;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```
4. Save and exit the file
5. Restart NGINX
```bash
sudo systemctl restart nginx
```
