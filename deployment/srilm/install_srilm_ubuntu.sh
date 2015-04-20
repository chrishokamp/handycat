# copy the srilm .tgz to $HOME

scp -i /home/chris/amazon_aws/aws-handycat.pem srilm.tgz ubuntu@ec2-52-28-61-16.eu-central-1.compute.amazonaws.com

# now ssh to AWS
# then
INSTALL_DIR=$HOME/programs/srilm
mkdir -p $INSTALL_DIR
mv srilm.tgz $INSTALL_DIR
cd $INSTALL_DIR tar xvf srilm.tgz

# fix the SRILM line in the Makefile
SRILM_HOME=$INSTALL_DIR
mv Makefile Makefile.default
echo SRILM=$SRILM_HOME > Makefile
# now cat the orignal Makefile after that line
cat Makefile.default >> Makefile

# this compiles for i686 (32bit) architecture
make World

# add $SRILM_HOME/ bin to $PATH
echo "export PATH=$SRILM_HOME/bin/i686-m64:$PATH" >> $HOME/.bashrc
source $HOME/.bashrc

