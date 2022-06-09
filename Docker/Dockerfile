FROM node:14

EXPOSE 8100

ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64
ENV GRADLE_HOME /usr/local/gradle
ENV GRADLE_VERSION 7.4.2
ENV ANDROID_API_LEVELS android-28
ENV ANDROID_HOME /usr/local/android-sdk-linux
ENV ANDROID_SDK_ROOT /usr/local/android-sdk-linux/cmdline-tools/latest/bin
ENV GLIB_PACKAGE_BASE_URL https://github.com/sgerrand/alpine-pkg-glibc/releases/download
ENV GLIB_VERSION 2.35-r0
ENV IONIC_VERSION 6.19.1
ENV PYTHONUNBUFFERED=1

ENV PATH ${GRADLE_HOME}/bin:${JAVA_HOME}/bin:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/emulator:$ANDROID_HOME/platform-tools:$PATH

RUN apt-get update

# INSTALL JAVA
RUN apt-get install openjdk-8-jdk -y

# INSTALL ANDROID
RUN mkdir -p ${ANDROID_HOME} && \
  curl -L https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip > /tmp/tools.zip && \
  unzip /tmp/tools.zip -d ${ANDROID_HOME} 

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools/latest && \
    cp -a ${ANDROID_HOME}/cmdline-tools/bin/. ${ANDROID_HOME}/cmdline-tools/latest/bin/ && \
    cp -a ${ANDROID_HOME}/cmdline-tools/lib/. ${ANDROID_HOME}/cmdline-tools/latest/lib/ && \
    rm -rf ${ANDROID_HOME}/cmdline-tools/bin/ && \
    rm -rf ${ANDROID_HOME}/cmdline-tools/lib/

#INSTALL Graddle
RUN mkdir -p ${GRADLE_HOME} && \
  curl -L https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip > /tmp/gradle.zip && \
  unzip /tmp/gradle.zip -d ${GRADLE_HOME} && \
  mv ${GRADLE_HOME}/gradle-${GRADLE_VERSION}/* ${GRADLE_HOME} && \
  rm -r ${GRADLE_HOME}/gradle-${GRADLE_VERSION}/

# INSTALL STUFF
RUN apt-get install vim make wget unzip openssl gcc curl -y
RUN apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev -y
RUN apt install python3 python3-pip -y
RUN pip3 install --no-cache --upgrade pip setuptools

# Install Android Stuff
RUN echo y | sdkmanager "platform-tools" "platforms;${ANDROID_API_LEVELS}"

# Installing Ionic
RUN npm install -g @ionic/cli@${IONIC_VERSION}


#FILES DELETION
RUN rm -rf /tmp/* /var/cache/apk/*

