# nimbus-web

Welcome to nimbus-web. Nimbus-web are the official web pages of the nimbus 3D web interface.

# Getting Started
If you downloaded the official rpi image from our nextcloud (https://cloud.pieye.org/index.php/s/c2QSa6P4wBtSJ4K), follow these steps:
```
cd ~
mkdir nimbus-web-src
git clone xxxx nimbus-web-src
ln -s /home/pi/nimbus-web-src/ /var/www/html/
```
Edit file /etc/nginx/sites-available/default (with sudo) and change line 41 from
```
root /var/www/html/nimbus-web;
```
to
```
root /var/www/html/nimbus-web-src;
```

On most browsers you have to hit CTRL+R to force the browser to reload the remote webfiles when you change the content of the files.

# Prerequisites
Download the current image from https://cloud.pieye.org/index.php/s/c2QSa6P4wBtSJ4K which contains nimbus-userland and all necessary linux drivers.

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
