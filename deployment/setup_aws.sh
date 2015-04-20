# build handycat -- LOCAL
#grunt handycat_builds
#tar kczf handycat_test_build.20.4.15.tar.gz handycat_builds 
#scp -r -i /home/chris/amazon_aws/aws-handycat.pem handycat_test_build.20.4.15.tar.gz ubuntu@ec2-52-28-61-16.eu-central-1.compute.amazonaws.com:~

# untar on remote
tar xzf handycat_test_build*.tar.gz

# clone/copy the handycat (pre-built) distribution
# TODO: This is done from the LOCAL MACHINE -- do this before the setup script
#HANDYCAT_BUILD_DIR=/home/chris/projects/angular/editor_components/handycat_builds
#scp -r -i /home/chris/amazon_aws/aws-handycat.pem -r $HANDYCAT_BUILD_DIR ubuntu@ec2-52-28-61-16.eu-central-1.compute.amazonaws.com:~
# OR -- tar the build dir from grunt
#tar kcf handycat_builds
#scp -r -i /home/chris/amazon_aws/aws-handycat.pem handcat_test_build.19.4.14.tar ubuntu@ec2-52-28-61-16.eu-central-1.compute.amazonaws.com:~

# SETTING UP PYTHONPATHS
# TODO: not tested
#ubuntu@ip-172-31-1-100:~/handycat_builds/microservices$ echo "export PYTHONPATH=`pwd`:\$PYTHONPATH" >> ~/.bashrc
#ubuntu@ip-172-31-1-100:~/handycat_builds/microservices$ source ~/.bashrc

sudo apt-get update

# install git
sudo apt-get install git 

# install mongodb
bash mongo_db/install_mongo.sh

# install redis
bash redis/install_redis.sh

# install the anaconda python distribution
wget https://3230d63b5fc54e62148e-c95ac804525aac4b6dba79b00b39d1d3.ssl.cf1.rackcdn.com/Anaconda-2.2.0-Linux-x86_64.sh
bash Anaconda*.sh
# USER INPUT REQUIRED HERE
# -- accept licence agreement and install prefix
# -- append anaconda/bin to PATH
source ~/.bashrc

# install all python deps
pip install -r python_library_requirements.txt

# install node and npm
./install_node_and_npm.sh

# install any global node deps
npm install -g forever

# run npm install for the express backend - TODO: or package deps in the build??
#cd to handycat_builds install location
npm install

# starting mongo
#mongod --fork --logpath=mongod.log --smallfiles

# or, package everything including data into the build -- HACK

# get the data and models from some server
PHRASE_TABLE_LOCATION=
HANDYCAT_DATA_HOME=/home/ubuntu/handycat_data
scp -r -i /home/chris/amazon_aws/aws-handycat.pem -r  ubuntu@ec2-52-28-61-16.eu-central-1.compute.amazonaws.com:$HANDYCAT_DATA_HOME

# TODO: seperate local config listing the location of all data, scp over to the server

# WORKING -- run npm install for all node microservices
for dir in `ls $YOUR_TOP_LEVEL_FOLDER`;
do
  for subdir in `ls $YOUR_TOP_LEVEL_FOLDER/$dir`;
    do
      # check if dir has a package.json
      # if it does, do `npm install`
      $(PLAY AS MUCH AS YOU WANT);
    done
done


# install pm2, 


#echo 'export PYTHONPATH=$PYTHONPATH:$HOME/cat_backend/post_editing_rules' >> ~/.bashrc

# How to generate a new ssh key (if you need to)
# ssh-keygen -t rsa -C "your.email@example.com"

# set environment variables

# PORTs, etc...
# Start servers and run tests

# use forever to start the express server

# this is critical -- paths are different in production
export NODE_ENV=production

HANDYCAT_MICROSERVICE_HOME=
# start the lm autocomplete service
python web.py


# make sure any previous servers are dead
killall -9 node

# running node
# reroute 5002 to 80 (so we can avoid using sudo)
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 5002

forever start -a -l ~/logs/forever.log -o ~/logs/out.log -e ~/logs/err.log --sourceDir ~/handycat_builds/ web.js
