#!/bin/bash

# Get dependencies (for adding repos)
sudo apt-get install -y python-software-properties
sudo add-apt-repository -y ppa:webupd8team/java
sudo apt-get update

# install oracle jdk 8
sudo apt-get install -y oracle-java8-installer
sudo update-alternatives --auto java
sudo update-alternatives --auto javac