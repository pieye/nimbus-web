<img src="./assets/PIEYE_Logo_RGB_POS.png" align="right"
     title="pieye logo" width="184" height="55">

# nimbus-web
Welcome to nimbus-web. Nimbus-web are the official web pages of the nimbus 3D web interface.

# Prerequisites
You must install nimbus-server (see https://github.com/pieye/nimbus-userland)

# Getting Started

Install nginx and git
```shell
sudo apt-get install nginx git
```

Clone this repository
```shell
git clone https://github.com/pieye/nimbus-web.git
```

Edit file /etc/nginx/sites-available/default (with sudo) and change line 41 from
```
root /var/www/html;
```
to
```
root /home/pi/nimbus-web;
```

restart nginx
```
sudo service nginx restart
```

Open a browser with the IP address of your raspberry pi.

# Contributing
Contributions are very welcome!

# Authors
Markus Proeller - Javascript classes

Sebastian Schmidt - UI

See also the list of contributors who participated in this project.

# License
This project is licensed under the GPLv3 License - see the LICENSE file for details

# 3rd party libraries
We use the following 3rd party libraries:
 - three.js, which is licensed under MIT license, see https://github.com/mrdoob/three.js
 - jquery, whcich is licensed under MIT license, see https://github.com/jquery/jquery
