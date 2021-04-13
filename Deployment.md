

# Deployment

We will be using [digitalocean](https://www.digitalocean.com/) and [namecheap](https://www.namecheap.com/) for this example. Create a new project in digitalocean and buy a domain.

​	For this example:

 - digitanocean project name - `Corder-bg`
 - namespace domain name - `corder-bg.xyz`

Code for the server and client here - [GitHub](https://github.com/AlexSPx/Corder)

## Preparation

#### 1. Creating a Droplet

1. Latest stable Ubuntu (20.04 x64 as the time of writing)
2. Basic plan - $5-6/month (1 GB / 1 CPU ; 25 BG SSD ; 1000 GB transfer)
3. Location that suits your needs
4. Authentication - SSH, if you don't have one or don't know how to create [click here](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) 
5. You can change the hostname to something that's not that long as the original, it will mainly appear in the terminal `root@{hostname}:~#`
6. Make sure the selected project you are asigning this droplet is the correct one.

It will take a few seconds for the server to setup. 

#### 2. Domains

​	Now we need to create DNS records *(`DNS/Domains`)* for the project so we can connect the server and domain.

1. Creating DNS records

![adding domain](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/Addings%20domain.png)

2. Setting @ and www A record

![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/%40%20record.png)

![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/www%20record.png)

3. Setting up custom DNS.

![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/Custom%20DNS.png) *namecheap console*

- `ns1.digitalocean.com.`

- `ns2.digitalocean.com.`

- `ns3.digitalocean.com.`

  ​	This might take up to 48 hours for the dns server to change. But usually is ready in a few minutes.

## Server

To connect with the ubuntu server we will use - ssh(Secure Shell Protocol).

#### 1. Connection

Navigate to where your ssh key is and run the following command in the terminal 

`ssh -i ~/{ssh_key} root@{IPv4}` 

Here it will be `ssh -i ~/corderkey root@178.62.69.88`

#### 2. Install Node/NPM

```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -

sudo apt install nodejs

node --version
```

This will install the latest stable 14.x node version

#### 3. Setup ufw firewall, install NGINX and Certbot

1.  **ufw firewall**

   ```
   sudo ufw enable
   sudo ufw status
   sudo ufw allow ssh (Port 22)
   sudo ufw allow http (Port 80)
   sudo ufw allow https (Port 443)
   ```

2. **Install NGINX**

   ```
   sudo apt install nginx
   ```

3. **Install Certbot**

   Here simply follow the guide on the official site for your distro - [here](https://certbot.eff.org/) 

   - For this project(Nginx - Ubuntu 20.04):

     ```
     sudo snap install --classic certbot
     sudo ln -s /snap/bin/certbot /usr/bin/certbot
     sudo certbot --nginx
     ```

     ![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/certbot%20setup.png)

     <div style="text-align:center">Now when we go to our domain (`corder-bg.xyz`) we can see the welcoming nginx page</div>

     ![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/welcome%20to%20nginx.png)

4. **Install pm2**

   ```
   sudo npm i pm2 -g
   pm2 start app (or whatever your file name)
   
   # Other pm2 commands
   pm2 show app
   pm2 status
   pm2 restart app
   pm2 stop app
   pm2 logs (Show log stream)
   pm2 flush (Clear logs)
   
   # To make sure app starts when reboot
   pm2 startup ubuntu
   ```

5. **Install Postgres**

   The installation procedure created a user account called **postgres** that is associated with the default Postgres role. There are a few ways to utilize this account to access Postgres. One way is to switch over to the **postgres** account on your server by typing:

   ```
   sudo apt install postgresql postgresql-contrib
   ```

   You can access the Postgres prompt by: 

   ```
   sudo -u postgres psql postgres
   ```

   To change the `postgres` user password type:

   ```
   postgres=# \password postgres
   ```

   Then type the password and confirm it.

   Create new database:

   ```
   sudo -u postgres createdb {db name}
   ```

   To exit the prompt type:

   ```
   postgres=# \q
   ```

6. **NGINX configuration**

   ```
   sudo vi /etc/nginx/sites-available/default
   ```

   In the second server block

   ```nginx
   location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection “upgrade”;
        proxy_max_temp_file_size 0;
        proxy_pass http://my_nodejs_upstream/;
        proxy_redirect off;
        proxy_read_timeout 240s;
   }
   
   #regular api calls
   location /api {
    	proxy_pass http://localhost:5001; #api port
   }
   
   #socket calls
   location /socket.io {
    	proxy_pass http://localhost:5001;
    	include proxy_params;
   	proxy_http_version 1.1;
   	proxy_buffering off;
    	proxy_set_header Upgrade $http_upgrade;
   	proxy_set_header Connection "Upgrade";
   }
   ```

   Above the server block

   ```nginx
   upstream my_nodejs_upstream {
        server 127.0.0.1:5000;
        keepalive 64;
   }
   ```

   Restart NGINX

   ```
sudo service nginx restart
   ```
   
1. **Install packages and upload the files**

   - Installing packages:

     Navigate to your main folder on your local machine. My folder structure:

     ![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/file%20structure.png)

     First we need to install the packages for the node server. The easiest way is to transfer the `server/package.json` to the ubuntu server and run `npm install`

     In your main folder run:

     ```
     scp -i ~/{ssh_key} -r server/package.json root@{IPv4}:
     ```

     ```
     scp -i ~/corderkey -r server/package.json root@104.236.95.206:
     ```

     If everything works by typing `ls` you should see it:
     ![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/pjson.png)

     Now simply run:

     ```
     npm install
     ```
   
      To run the React app we need only the `serve` package:
   
     ```
     npm i -g serve
     ```

   - Uploading files:

     Transferring files from your local machine to the server distro:

     ```
     scp -i ~/{ssh_key} -r {location} root@{IPv4}:{location on the ubuntu}
     ```

     For the server:

     ```
     scp -i ~/corderkey -r server/dist root@178.62.69.88:server
     ```

     For the client:

     ```
     scp -i ~/corderkey -r newclient/build root@178.62.69.88:client
     ```

     ![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/client_server_show.png)

   Now let's check if everything is running correctly:

- Start server with pm2:

  ```
  pm2 start server
  ```

- Start client with pm2:

  ```
  pm2 start serve -- -s client
  ```

  ![](https://raw.githubusercontent.com/AlexSPx/Corder/main/Deployment%20images/finish.png)