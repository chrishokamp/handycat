# build handycat
cd ..
grunt handycat_builds
tar kczf handycat_test_build.20.4.15.tar.gz handycat_builds 
scp -r -i /home/chris/amazon_aws/aws-handycat.pem handycat_test_build.20.4.15.tar.gz ubuntu@ec2-52-28-61-16.eu-central-1.compute.amazonaws.com:~
