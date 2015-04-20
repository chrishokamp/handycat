sudo apt-get install -y build-essential

echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
. ~/.bashrc
mkdir ~/local
mkdir ~/node-latest-install
cd ~/node-latest-install
./configure --prefix=/home/${USER}/local
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
# TODO: this version of the prefix has not been tested -- test and confirm
make install # ok, fine, this step probably takes more than 30 seconds...

cd /home/ubuntu
sudo apt-get install ca-certificates
export CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
curl https://www.npmjs.org/install.sh | sh
