pipeline {
  agent any
  stages {
    stage('NodeJS update') {
      steps {
        sh 'node install'
      }
    }

    stage('PM2 restart') {
      steps {
        sh 'pm2 restart all'
      }
    }

  }
}