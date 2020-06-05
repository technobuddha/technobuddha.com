# Introduction

This is a work in progress.   At any given moment there is a greater than 50% chance that it won't work.

Development on this system is done in a Virtual Machine running Ubuntu 20.  Although this *should* run on any operating system this hasn't been attempted at this point in time.

# Prerequisites

### Node.js

> $ sudo apt-get install curl<br/>
> $ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -M<br/>
> $ sudo apt-get install node<br/>
> $ node --version<br/>
> v12.17.0


### PostgreSQL

>  sudo apt-get install postgresql postgresql-contrib

* Edit the file /etc/postgresql/12/main/pg_hba.conf (will require sudo)
* Find the line

    local   all             postgres                                peer

* Change it to

    local   all             postgres                                trust

> $ sudo systemctl restart postgresql<br/>
> $ psql --version<br/>
> psql (PostgreSQL) 12.2 (Ubuntu 12.2-4)<br/>
> $ npm --version<br/>
> 6.14.4


### git

> $ sudo apt-get install git

# Installation

> $ git clone https://github.com/technobuddha/hill.software.git<br/>
> $ cd hill.software<br/>
> $ npm install<br/>
> $ npm run migrate up

# Running the application

> $ npm start

Open your browser to `http://localhost:7777`




