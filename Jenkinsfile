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
        sh 'sudo pm2 restart all'
      }
    }

  }
}
