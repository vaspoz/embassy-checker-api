pipeline {
  agent any
  stages {
    stage('npm install') {
      steps {
        sh 'npm install'
      }
    }

    stage('pm2 restart') {
      steps {
        sh 'pm2 restart all'
      }
    }

  }
}
