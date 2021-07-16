pipeline {
  agent any
  stages {
    stage('NodeJS update') {
      steps {
        sh 'echo "aaa"'
      }
    }

    stage('PM2 restart') {
      steps {
        sh 'pm2 restart all'
      }
    }

  }
}