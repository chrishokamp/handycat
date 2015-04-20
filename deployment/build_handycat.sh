# build handycat
cd ..
grunt handycat_builds
tar kczf handycat_test_build.20.4.15.tar.gz handycat_builds 

scp -r -i /home/chris/amazon_aws/aws-handycat.pem handycat_test_build.20.4.15.tar.gz ubuntu@ec2-52-28-61-16.eu-central-1.compute.amazonaws.com:~

ssh -i /home/chris/amazon_aws/aws-handycat.pem ubuntu@ec2-52-28-61-16.eu-central-1.compute.amazonaws.com  

# untar on remote
tar xzf handycat_test_build*.tar.gz
export NODE_ENV=production

cd handycat_builds
npm install
cd microservices/vocabulary_server
npm install
pm2 start web.js
cd ~/handycat_builds/microservices/xliff_creator
pm2 start web.js
cd ~/handycat_builds
pm2 start web.js

echo 'started handycat'
exit

#cd ~/handycat_builds/microservices/lm_autocomplete
cd ~/handycat_builds/microservices/lm_autocomplete
nohup python web.py > production_log.out &
# TODO: change data paths for lm_autocomplete -- read production config with data paths
#nohup python 

#cd to handycat_builds install location
